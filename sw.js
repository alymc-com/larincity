// Holding page: retire the old service worker so returning visitors are not
// served the previous site from their cache.
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) await caches.delete(k);
  await self.clients.claim();
  for (const c of await self.clients.matchAll({ type: 'window' })) c.navigate(c.url);
  await self.registration.unregister();
})()));
