import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import Parser from 'rss-parser';

admin.initializeApp();

const parser = new Parser();

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

          // Clean HTML from summary
          const cleanSummary = (item.contentSnippet || item.content || '').replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';

          await newsRef.set({
            title: item.title,
            summary: cleanSummary,
            body: item.content || item.contentSnippet,
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
