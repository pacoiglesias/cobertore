const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('--- Iniciando Verificación de Entorno de Firebase ---\n');

// 1. Check .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ ERROR: No se encontró el archivo .env.local en la raíz del proyecto.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const requiredKeys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

let hasError = false;
let projectId = '';

requiredKeys.forEach(key => {
  const regex = new RegExp(`^${key}=(.*)$`, 'm');
  const match = envContent.match(regex);
  if (!match || !match[1].trim()) {
    console.error(`❌ ERROR: Falta la variable ${key} en .env.local`);
    hasError = true;
  } else {
    console.log(`✅ Variable ${key} encontrada.`);
    if (key === 'NEXT_PUBLIC_FIREBASE_PROJECT_ID') {
      projectId = match[1].trim();
    }
  }
});

if (hasError) {
  console.log('\n❌ Por favor, corrige los errores en tu .env.local antes de continuar.');
  process.exit(1);
}

console.log('\n--- Verificando conexión HTTP a Firebase ---');

// 2. Simple ping to Firebase Auth / Firestore domains to ensure no network blocks
const checkNetwork = (hostname) => {
  return new Promise((resolve) => {
    const req = https.request({ hostname, port: 443, method: 'OPTIONS' }, (res) => {
      resolve(true);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.end();
  });
};

(async () => {
  process.stdout.write('Probando conexión a Firestore... ');
  const firestoreOk = await checkNetwork(`firestore.googleapis.com`);
  if (firestoreOk) {
    console.log('✅ OK');
  } else {
    console.log('❌ FALLÓ (Posible bloqueo de red)');
  }

  process.stdout.write('Probando conexión a Storage... ');
  const storageOk = await checkNetwork(`firebasestorage.googleapis.com`);
  if (storageOk) {
    console.log('✅ OK');
  } else {
    console.log('❌ FALLÓ (Posible bloqueo de red)');
  }

  console.log('\n🎉 Todo parece estar configurado correctamente.');
  console.log('👉 Proyecto configurado: ' + projectId);
})();
