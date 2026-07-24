self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // En Next.js App Router (static export), hacer caché complejo puede romper la navegación.
  // Por ahora, solo interceptamos para que el navegador reconozca esto como PWA instalable.
  // Podríamos agregar caché de red pero para esta empresa, lo importante es que sea "Instalable"
});
