import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import type { CallableRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { createHash } from 'node:crypto';
import Parser from 'rss-parser';

admin.initializeApp();

const parser = new Parser();

// ---------------------------------------------------------------------------
// EmailJS desde el servidor (C-2)
// Antes la clave pública, el servicio y la plantilla estaban literales en el
// navegador y cualquiera podía enviar correos con cargo a la cuota de Mano Fil.
// Ahora el envío se hace aquí, en el servidor. Los IDs de servicio/plantilla
// son identificadores (no secretos), pero la clave PRIVADA sí es un secreto y
// debe configurarse ANTES de desplegar las funciones:
//
//   firebase functions:secrets:set EMAILJS_PRIVATE_KEY
//
// (valor: la "Private Key" del panel de EmailJS). Sin ese secreto el despliegue
// falla; con el secreto sin configurar en runtime, submitLead guarda el lead
// pero no envía el correo (lo registra en el log) y sendQuoteEmail avisa.
// ---------------------------------------------------------------------------
const EMAILJS_SERVICE_ID = 'service_xhdjd9e';
const EMAILJS_TEMPLATE_ID = 'template_g523gds';
const EMAILJS_PUBLIC_KEY = 'rnWVm41Zez5G-ehqq';
const emailjsPrivateKey = defineSecret('EMAILJS_PRIVATE_KEY');

// Lista única de súper administradores (C-11: la misma que en
// firestore.rules, storage.rules y src/app/intranet/dashboard/page.tsx).
const SUPER_ADMIN_EMAILS = [
  'paco.iglesias@gmail.com',
  'paco@cobertores.com',
  'pacoismael@gmail.com',
];

// Quita etiquetas HTML y deja texto plano (C-8: nunca guardar HTML crudo de
// feeds RSS de terceros; si algún día se renderiza como HTML sería un XSS).
function stripTags(value: string | undefined | null): string {
  return (value || '').replace(/<[^>]*>?/gm, '').trim();
}

// Envía un correo con la plantilla de EmailJS. Devuelve true si se envió,
// false si el secreto no está configurado (el llamador decide qué hacer).
// Lanza un Error si EmailJS responde con un fallo HTTP.
async function sendEmailViaEmailJs(templateParams: Record<string, string>): Promise<boolean> {
  let privateKey: string | undefined;
  try {
    privateKey = emailjsPrivateKey.value();
  } catch {
    privateKey = undefined;
  }
  if (!privateKey) {
    console.warn(
      'EMAILJS_PRIVATE_KEY no configurado: correo no enviado. ' +
      'Configúralo con: firebase functions:secrets:set EMAILJS_PRIVATE_KEY',
    );
    return false;
  }
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
      accessToken: privateKey,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`EmailJS respondió ${res.status}: ${text}`);
  }
  return true;
}

// ---------------------------------------------------------------------------
// Leads (C-1): creación con validación y rate-limit EN EL SERVIDOR
// La regla de Firestore ya no permite crear leads directamente desde el
// cliente: solo esta función (Admin SDK) puede escribir en /leads. El límite
// de 1 envío cada 5 minutos y el honeypot, que antes solo existían en el
// navegador, ahora se aplican aquí. El rate-limit se guarda por IP con hash
// SHA-256 (nunca se almacena la IP en claro) en /lead_rate_limits.
// ---------------------------------------------------------------------------
const LEAD_MIN_INTERVAL_MS = 5 * 60 * 1000; // 1 lead cada 5 minutos por IP
const LEAD_MAX_PER_DAY = 20; // tope diario por IP

function getClientIp(request: CallableRequest): string {
  const raw = request.rawRequest;
  const forwarded = raw?.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return raw?.ip || 'unknown';
}

async function checkLeadRateLimit(ipHash: string): Promise<void> {
  const db = getFirestore();
  const ref = db.collection('lead_rate_limits').doc(ipHash);
  const nowMs = Date.now();
  const today = new Date().toISOString().slice(0, 10); // día UTC
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data() || {};
    const lastSubmitMs = typeof data.lastSubmitMs === 'number' ? data.lastSubmitMs : 0;
    if (nowMs - lastSubmitMs < LEAD_MIN_INTERVAL_MS) {
      throw new HttpsError(
        'resource-exhausted',
        'Hemos recibido tu mensaje anterior. Por favor espera 5 minutos para enviar otra cotización.',
      );
    }
    const dayKey = typeof data.dayKey === 'string' ? data.dayKey : '';
    const countDay = dayKey === today && typeof data.countDay === 'number' ? data.countDay : 0;
    if (countDay >= LEAD_MAX_PER_DAY) {
      throw new HttpsError(
        'resource-exhausted',
        'Has alcanzado el límite diario de mensajes. Inténtalo mañana.',
      );
    }
    tx.set(ref, { lastSubmitMs: nowMs, dayKey: today, countDay: countDay + 1 }, { merge: true });
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const submitLead = onCall({ secrets: [emailjsPrivateKey] }, async (request) => {
  const data = (request.data ?? {}) as Record<string, unknown>;

  // Honeypot: si un bot llenó el campo invisible, éxito falso y no se guarda nada.
  if (typeof data._honey === 'string' && data._honey !== '') {
    return { ok: true };
  }

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const quantity = typeof data.quantity === 'string' ? data.quantity.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';

  if (name.length < 3 || name.length > 100) {
    throw new HttpsError('invalid-argument', 'El nombre debe tener entre 3 y 100 caracteres.');
  }
  if (phone.length < 6 || phone.length > 30) {
    throw new HttpsError('invalid-argument', 'El teléfono debe tener entre 6 y 30 caracteres.');
  }
  if (email.length < 6 || email.length > 100 || !EMAIL_RE.test(email)) {
    throw new HttpsError('invalid-argument', 'El correo electrónico no tiene un formato válido.');
  }
  if (quantity.length < 1 || quantity.length > 100) {
    throw new HttpsError('invalid-argument', 'La cantidad no es válida.');
  }
  if (message.length < 1 || message.length > 1000) {
    throw new HttpsError('invalid-argument', 'El mensaje debe tener entre 1 y 1000 caracteres.');
  }

  const ipHash = createHash('sha256').update(getClientIp(request)).digest('hex');
  await checkLeadRateLimit(ipHash);

  const db = getFirestore();
  await db.collection('leads').add({
    name,
    phone,
    email,
    quantity,
    message,
    createdAt: FieldValue.serverTimestamp(),
  });

  // El correo es "best-effort": si falla, el lead ya quedó guardado (igual que
  // antes, cuando el fallo de EmailJS en el navegador no impedía el envío).
  try {
    await sendEmailViaEmailJs({ name, phone, email, quantity, message });
  } catch (err) {
    console.error('Error enviando notificación de lead por EmailJS:', err);
  }

  return { ok: true };
});

// ---------------------------------------------------------------------------
// Cotizaciones (C-2): envío de correo desde el servidor, solo personal
// autorizado (súper admin o editor vigente). El PDF se sigue subiendo a
// Storage desde el cliente; aquí solo se envía el correo con el enlace.
// ---------------------------------------------------------------------------
export const sendQuoteEmail = onCall({ secrets: [emailjsPrivateKey] }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Inicia sesión en la intranet para enviar cotizaciones.');
  }

  const db = getFirestore();
  const callerEmail = request.auth.token.email || '';
  const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(callerEmail);
  let isEditor = false;
  if (!isSuperAdmin && callerEmail) {
    const priv = await db.collection('user_privileges').doc(callerEmail).get();
    const privData = priv.data() || {};
    const expiresAt = privData.expiresAt as { toMillis?: () => number } | null | undefined;
    const notExpired = !expiresAt || (typeof expiresAt.toMillis !== 'function') || expiresAt.toMillis() > Date.now();
    isEditor = privData.role === 'editor' && notExpired;
  }
  if (!isSuperAdmin && !isEditor) {
    throw new HttpsError('permission-denied', 'Tu usuario no tiene permiso para enviar cotizaciones.');
  }

  const data = (request.data ?? {}) as Record<string, unknown>;
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const quantity = typeof data.quantity === 'string' ? data.quantity.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';

  if (name.length < 1 || name.length > 100) {
    throw new HttpsError('invalid-argument', 'El nombre del cliente no es válido.');
  }
  if (email.length < 6 || email.length > 100 || !EMAIL_RE.test(email)) {
    throw new HttpsError('invalid-argument', 'El correo del cliente no tiene un formato válido.');
  }
  if (message.length < 1 || message.length > 2000) {
    throw new HttpsError('invalid-argument', 'El mensaje de la cotización no es válido.');
  }

  let sent: boolean;
  try {
    sent = await sendEmailViaEmailJs({ name, phone, email, quantity, message });
  } catch (err) {
    console.error('Error enviando cotización por EmailJS:', err);
    throw new HttpsError('internal', 'El servicio de correo devolvió un error. Inténtalo de nuevo.');
  }
  if (!sent) {
    throw new HttpsError(
      'failed-precondition',
      'El envío de correo no está configurado (falta el secreto EMAILJS_PRIVATE_KEY en las funciones). La cotización quedó guardada en Storage pero el correo no se envió.',
    );
  }
  return { ok: true };
});

export const fetchNewsPeriodically = functions.scheduler.onSchedule({
  schedule: 'every 6 hours',
  timeZone: 'America/Mexico_City',
}, async (event) => {
  const db = getFirestore();

  // 1. Fetch RSS sources from system settings
  const settingsDoc = await db.collection('system_settings').doc('global').get();
  const newsSources = settingsDoc.data()?.newsSources || [];

  const activeSources = newsSources.filter((s: any) => s.active);

  if (activeSources.length === 0) {
    console.log('No active RSS sources found.');
    return;
  }

  console.log(`Found ${activeSources.length} active sources. Fetching...`);

  for (const source of activeSources) {
    try {
      const feed = await parser.parseURL(source.url);

      // We only take the latest 3 items per source to avoid flooding
      const items = feed.items.slice(0, 3);

      for (const item of items) {
        // Hash the link or title to use as ID
        const docId = Buffer.from(item.link || item.title || Date.now().toString()).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);

        const newsRef = db.collection('news').doc(docId);
        const exists = (await newsRef.get()).exists;

        if (!exists) {
          // Extract an image if possible
          let imgUrl = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000'; // fallback
          if (item.enclosure?.url) {
            imgUrl = item.enclosure.url;
          } else if (item.content) {
            // regex to find img tag
            const match = item.content.match(/<img[^>]+src="([^">]+)"/);
            if (match && match[1]) {
              imgUrl = match[1];
            }
          }

          // Clean HTML from summary AND body (C-8): el contenido RSS es de
          // terceros y se guarda como texto plano, nunca como HTML crudo.
          const cleanSummary = stripTags(item.contentSnippet || item.content).substring(0, 150) + '...';
          const cleanBody = stripTags(item.content || item.contentSnippet).substring(0, 5000);

          await newsRef.set({
            title: stripTags(item.title),
            summary: cleanSummary,
            body: cleanBody,
            sourceName: source.name,
            originalUrl: item.link,
            imgUrl: imgUrl,
            createdAt: FieldValue.serverTimestamp()
          });
          console.log(`Imported news: ${item.title}`);
        }
      }
    } catch (err) {
      console.error(`Error fetching feed ${source.url}:`, err);
    }
  }

  console.log('Finished fetching news.');
});
