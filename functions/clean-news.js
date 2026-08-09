const admin = require('firebase-admin');

// Inicializamos con Application Default Credentials
// Esto funcionará automáticamente si tienes sesión iniciada con firebase CLI (o gcloud)
admin.initializeApp();

async function cleanNews() {
  const db = admin.firestore();
  const newsRef = db.collection('news');
  
  console.log("Iniciando escaneo de la colección 'news'...");
  const snapshot = await newsRef.get();
  let deletedCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    // Identificamos basura: IDs codificados en base64 (empiezan con aHR0) o sin título
    if (doc.id.startsWith('aHR0') || !data.title || data.title.trim() === '') {
      console.log(`[🗑️ Borrando] ID: ${doc.id}`);
      await doc.ref.delete();
      deletedCount++;
    }
  }
  
  console.log(`\n✅ Limpieza completada. Se purgaron permanentemente ${deletedCount} noticias basura.`);
}

cleanNews().catch((err) => {
  console.error("❌ Error durante la limpieza:", err);
  if (err.message.includes("Could not load the default credentials") || err.message.includes("Failed to parse")) {
    console.error("\n👉 Recuerda que necesitas haber iniciado sesión en Firebase CLI primero (firebase login --reauth).");
  }
});
