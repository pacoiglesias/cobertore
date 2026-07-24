"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerNewsFetch = exports.fetchNewsPeriodically = void 0;
const functions = __importStar(require("firebase-functions/v2"));
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const rss_parser_1 = __importDefault(require("rss-parser"));
admin.initializeApp();
const parser = new rss_parser_1.default();
const SUPER_ADMIN_EMAILS = [
    'paco.iglesias@gmail.com',
    'paco@cobertores.com',
    'pacoismael@gmail.com',
];
// Mismas 3 fuentes que SystemSettings.tsx propone como default en el
// dashboard. Si nadie ha guardado `newsSources` todavia en
// `system_settings/global`, usamos estas para que el pipeline funcione
// desde el primer dia en vez de quedarse en silencio con una lista vacia.
const DEFAULT_NEWS_SOURCES = [
    { id: '1', name: 'Tlaxcala (El Sol)', url: 'https://www.elsoldetlaxcala.com.mx/rss.xml', active: true },
    { id: '2', name: 'Deportes (ESPN)', url: 'https://www.espn.com.mx/espn/rss/news', active: true },
    { id: '3', name: 'Espectaculos (TVNotas)', url: 'https://www.tvnotas.com.mx/rss.xml', active: true },
];
// Verifica super admin (whitelist) o editor vigente (Firestore), igual que
// firestore.rules / storage.rules -- se repite aqui porque las Cloud
// Functions no pueden "heredar" las Security Rules, corren con permisos de
// administrador y deben validar el rol ellas mismas.
async function assertIsAdminOrEditor(db, email) {
    if (!email) {
        throw new https_1.HttpsError('unauthenticated', 'Debes iniciar sesion.');
    }
    if (SUPER_ADMIN_EMAILS.includes(email))
        return;
    const privDoc = await db.collection('user_privileges').doc(email).get();
    if (!privDoc.exists) {
        throw new https_1.HttpsError('permission-denied', 'No tienes privilegios asignados.');
    }
    const data = privDoc.data();
    const notExpired = !data?.expiresAt || data.expiresAt.toDate() > new Date();
    const hasRole = data?.role === 'editor' || data?.role === 'lector';
    if (!notExpired || !hasRole) {
        throw new https_1.HttpsError('permission-denied', 'Tu privilegio expiro o no tiene el rol requerido.');
    }
}
async function runNewsFetch(db) {
    const settingsDoc = await db.collection('system_settings').doc('global').get();
    const storedSources = settingsDoc.data()?.newsSources;
    const newsSources = storedSources && storedSources.length > 0 ? storedSources : DEFAULT_NEWS_SOURCES;
    const activeSources = newsSources.filter((s) => s.active);
    if (activeSources.length === 0) {
        console.log('No active RSS sources found.');
        return { sourcesChecked: 0, itemsImported: 0 };
    }
    console.log(`Found ${activeSources.length} active sources. Fetching...`);
    let itemsImported = 0;
    for (const source of activeSources) {
        try {
            const feed = await parser.parseURL(source.url);
            // Tomamos solo los ultimos 3 items por fuente para no inundar el feed
            const items = feed.items.slice(0, 3);
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
                    }
                    else if (item.content) {
                        const match = item.content.match(/<img[^>]+src="([^">]+)"/);
                        if (match && match[1]) {
                            imgUrl = match[1];
                        }
                    }
                    // Limpiar HTML del resumen
                    const cleanSummary = (item.contentSnippet || item.content || '').replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
                    await newsRef.set({
                        title: item.title,
                        summary: cleanSummary,
                        body: item.content || item.contentSnippet,
                        sourceName: source.name,
                        originalUrl: item.link,
                        imgUrl: imgUrl,
                        createdAt: firestore_1.FieldValue.serverTimestamp(),
                    });
                    console.log(`Imported news: ${item.title}`);
                    itemsImported++;
                }
            }
        }
        catch (err) {
            console.error(`Error fetching feed ${source.url}:`, err);
        }
    }
    console.log(`Finished fetching news. ${itemsImported} new items imported.`);
    return { sourcesChecked: activeSources.length, itemsImported };
}
exports.fetchNewsPeriodically = functions.scheduler.onSchedule({
    schedule: 'every 6 hours',
    timeZone: 'America/Mexico_City',
}, async () => {
    const db = (0, firestore_1.getFirestore)();
    await runNewsFetch(db);
});
// Trigger manual desde la intranet ("Actualizar RSS ahora"), en vez de
// esperar hasta 6 horas al siguiente corte del cron. Protegido: solo
// super admin o editor pueden dispararlo.
exports.triggerNewsFetch = functions.https.onCall(async (request) => {
    const db = (0, firestore_1.getFirestore)();
    await assertIsAdminOrEditor(db, request.auth?.token?.email);
    const result = await runNewsFetch(db);
    return result;
});
//# sourceMappingURL=index.js.map