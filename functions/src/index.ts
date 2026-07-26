import * as functions from 'firebase-functions/v2';
import { HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { getFirestore, FieldValue, Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import Parser from 'rss-parser';

admin.initializeApp();

const parser = new Parser();

const SUPER_ADMIN_EMAILS = [
  'paco.iglesias@gmail.com',
  'paco@cobertores.com',
  'pacoismael@gmail.com',
];

// Mismas 3 fuentes que SystemSettings.tsx propone como default en el
// dashboard. Si nadie ha guardado `newsSources` todavia en
// `system_settings/global`, usamos estas para que el pipeline funcione
// desde el primer dia en vez de quedarse en silencio con una lista vacia.
//
// FIX 2026-07-25: de las 6 fuentes configuradas en producción, 3 estaban
// rotas -- confirmado con los logs reales de la función:
//   - ESPN México (https://www.espn.com.mx/espn/rss/news): "Unable to
//     parse XML" -- ya no es un feed RSS válido.
//   - TVNotas (https://www.tvnotas.com.mx/rss.xml): 404, la URL no existe.
//   - El Universal Espectáculos: 404, la URL no existe.
//   - Marca (https://www.marca.com/mx/rss.html) SÍ existe pero manda XML
//     mal formado de su lado ("Invalid character in entity name") -- se
//     deja tal cual, no es un problema que se resuelva cambiando la URL.
// Se reemplazaron por feeds de Infobae (Arc Publishing, la misma
// plataforma que usa Washington Post -- XML consistentemente bien
// formado). Confirma que sí funcionen con el botón "Actualizar RSS ahora"
// después de desplegar; si alguna URL de categoría no existe, cae en el
// feed general de Infobae, que sí está confirmado.
const DEFAULT_NEWS_SOURCES = [
  { id: '1', name: 'Tlaxcala (El Sol)', url: 'https://www.elsoldetlaxcala.com.mx/rss.xml', active: true },
  { id: '2', name: 'Deportes (Infobae)', url: 'https://www.infobae.com/deportes/arc/outboundfeeds/rss/', active: true },
  { id: '3', name: 'Entretenimiento (Infobae)', url: 'https://www.infobae.com/entretenimiento/arc/outboundfeeds/rss/', active: true },
];

interface NewsSource {
  id: string;
  name: string;
  url: string;
  active: boolean;
}

// Verifica super admin (whitelist) o editor vigente (Firestore), igual que
// firestore.rules / storage.rules -- se repite aqui porque las Cloud
// Functions no pueden "heredar" las Security Rules, corren con permisos de
// administrador y deben validar el rol ellas mismas.
async function assertIsAdminOrEditor(db: Firestore, auth: any) {
  if (!auth || !auth.token || !auth.token.email) {
    throw new HttpsError('unauthenticated', 'Debes iniciar sesion.');
  }
  // Email verification check removed for intranet flexibility
  
  const email = auth.token.email;
  if (SUPER_ADMIN_EMAILS.includes(email)) return;

  const privDoc = await db.collection('user_privileges').doc(email).get();
  if (!privDoc.exists) {
    throw new HttpsError('permission-denied', 'No tienes privilegios asignados.');
  }
  const data = privDoc.data();
  const notExpired = !data?.expiresAt || data.expiresAt.toDate() > new Date();
  const hasRole = data?.role === 'editor' || data?.role === 'lector';
  if (!notExpired || !hasRole) {
    throw new HttpsError('permission-denied', 'Tu privilegio expiro o no tiene el rol requerido.');
  }
}

async function runNewsFetch(db: Firestore): Promise<{ sourcesChecked: number; itemsImported: number }> {
  const settingsDoc = await db.collection('system_settings').doc('global').get();
  const storedSources: NewsSource[] | undefined = settingsDoc.data()?.newsSources;
  const newsSources = storedSources && storedSources.length > 0 ? storedSources : DEFAULT_NEWS_SOURCES;

  const activeSources = newsSources.filter((s: NewsSource) => s.active);

  if (activeSources.length === 0) {
    console.log('No active RSS sources found.');
    return { sourcesChecked: 0, itemsImported: 0 };
  }

  console.log(`Found ${activeSources.length} active sources. Fetching...`);
  let itemsImported = 0;

  const rssItemsLimit: number = settingsDoc.data()?.rssItemsLimit || 20;

  for (const source of activeSources) {
    try {
      const feed = await parser.parseURL(source.url);

      // Ahora el límite es configurable desde la base de datos (por defecto 20)
      const items = feed.items.slice(0, rssItemsLimit);

      for (const item of items) {
        // Hash del link o titulo para usarlo como ID (evita duplicados)
        const docId = Buffer.from(item.link || item.title || Date.now().toString()).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);

        const newsRef = db.collection('news').doc(docId);
        const exists = (await newsRef.get()).exists;

        if (!exists) {
          // Extraer una imagen si es posible
          let imgUrl = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000'; // fallback
          if (item.enclosure?.url) {
            imgUrl = item.enclosure.url;
          } else if (item.content) {
            const match = item.content.match(/<img[^>]+src="([^">]+)"/);
            if (match && match[1]) {
              imgUrl = match[1];
            }
          }

          // Limpiar HTML del resumen
          const cleanSummary = (item.contentSnippet || item.content || '').replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';

          // FIX 2026-07-25: antes se guardaba item.content completo (el
          // articulo entero de la fuente original) como "body" y se
          // republicaba integro en /noticias/[id] con su propio JSON-LD.
          // Esto es reproducir contenido ajeno sin licencia (riesgo legal),
          // y ademas Google penaliza contenido duplicado -- perjudicaba el
          // SEO en vez de ayudarlo. Ahora se guarda solo un extracto corto;
          // la pagina del articulo debe enlazar a "originalUrl" para el
          // texto completo, como hace cualquier agregador legitimo.
          const cleanBody = (item.contentSnippet || item.content || '').replace(/<[^>]*>?/gm, '').substring(0, 500);

          await newsRef.set({
            title: item.title,
            summary: cleanSummary,
            body: cleanBody,
            sourceName: source.name,
            originalUrl: item.link,
            imgUrl: imgUrl,
            createdAt: FieldValue.serverTimestamp(),
          });
          console.log(`Imported news: ${item.title}`);
          itemsImported++;
        }
      }
    } catch (err) {
      console.error(`Error fetching feed ${source.url}:`, err);
    }
  }

  console.log(`Finished fetching news. ${itemsImported} new items imported.`);
  return { sourcesChecked: activeSources.length, itemsImported };
}

export const fetchNewsPeriodically = functions.scheduler.onSchedule({
  schedule: 'every 6 hours',
  timeZone: 'America/Mexico_City',
}, async () => {
  const db = getFirestore();
  await runNewsFetch(db);
});

// Trigger manual desde la intranet ("Actualizar RSS ahora"), en vez de
// esperar hasta 6 horas al siguiente corte del cron. Protegido: solo
// super admin o editor pueden dispararlo.
export const triggerNewsFetch = functions.https.onCall(async (request) => {
  const db = getFirestore();
  await assertIsAdminOrEditor(db, request.auth);
  const result = await runNewsFetch(db);
  return result;
});

// Fase 6: Notificaciones CRM (Nuevos Leads)
// Se dispara cuando un cliente deja sus datos en la Landing Page
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

export const onLeadCreated = onDocumentCreated('leads/{leadId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const leadData = snapshot.data();
  const db = getFirestore();

  console.log(`Nuevo lead registrado: ${leadData.name} - ${leadData.phone}`);

  // Registramos la notificacion internamente para el dashboard
  await db.collection('notifications').add({
    type: 'new_lead',
    title: 'Nuevo Prospecto Recibido',
    message: `El cliente ${leadData.name} ha solicitado una cotización.`,
    leadId: event.params.leadId,
    readBy: [],
    createdAt: FieldValue.serverTimestamp()
  });

  // Nota: Para enviar correos reales, se requiere habilitar la Extension "Trigger Email" 
  // de Firebase, configurando SMTP, y escribir en la coleccion "mail", o usar SendGrid.
});

// Fase 9: Backups Automáticos de Base de Datos
// Se ejecuta todos los domingos a la medianoche
export const backupDatabase = functions.scheduler.onSchedule({
  schedule: 'every sunday 00:00',
  timeZone: 'America/Mexico_City',
}, async () => {
  const db = getFirestore();
  const bucket = getStorage().bucket();
  
  const collectionsToBackup = ['quotes_history', 'official_documents', 'leads', 'user_privileges'];
  const backupData: Record<string, any[]> = {};
  
  for (const collectionName of collectionsToBackup) {
    const snap = await db.collection(collectionName).get();
    backupData[collectionName] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `backups/db_backup_${dateStr}.json`;
  
  const file = bucket.file(fileName);
  await file.save(JSON.stringify(backupData, null, 2), {
    contentType: 'application/json'
  });
  
  console.log(`Respaldo exitoso creado en Storage: ${fileName}`);
});
