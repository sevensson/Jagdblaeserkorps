// Service Worker vorerst ohne Datei-Cache.
// Während der Entwicklung sollen immer die aktuellen Dateien geladen werden.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", () => {
  // Kein Caching während der Entwicklung.
});
