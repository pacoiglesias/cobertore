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
exports.fetchNewsPeriodically = void 0;
const functions = __importStar(require("firebase-functions/v2"));
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const rss_parser_1 = __importDefault(require("rss-parser"));
admin.initializeApp();
const parser = new rss_parser_1.default();
exports.fetchNewsPeriodically = functions.scheduler.onSchedule({
    schedule: 'every 6 hours',
    timeZone: 'America/Mexico_City',
}, async (event) => {
    const db = (0, firestore_1.getFirestore)();
    // 1. Fetch RSS sources from system settings
    const settingsDoc = await db.collection('system_settings').doc('global').get();
    const newsSources = settingsDoc.data()?.newsSources || [];
    const activeSources = newsSources.filter((s) => s.active);
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
                    }
                    else if (item.content) {
                        // regex to find img tag
                        const match = item.content.match(/<img[^>]+src="([^">]+)"/);
                        if (match && match[1]) {
                            imgUrl = match[1];
                        }
                    }
                    // Clean HTML from summary
                    const cleanSummary = (item.contentSnippet || item.content || '').replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
                    await newsRef.set({
                        title: item.title,
                        summary: cleanSummary,
                        body: item.content || item.contentSnippet,
                        sourceName: source.name,
                        originalUrl: item.link,
                        imgUrl: imgUrl,
                        createdAt: firestore_1.FieldValue.serverTimestamp()
                    });
                    console.log(`Imported news: ${item.title}`);
                }
            }
        }
        catch (err) {
            console.error(`Error fetching feed ${source.url}:`, err);
        }
    }
    console.log('Finished fetching news.');
});
//# sourceMappingURL=index.js.map