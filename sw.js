const CACHE_NAME = "jagdblaeser-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./images/logo.png",
  "./images/icon-192.png",
  "./images/icon-512.png"
];


/* =========================================================
   INSTALLATION
   Grunddateien der App speichern
   ========================================================= */

self.addEventListener("install", (event) => {

  event.waitUntil(

    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(APP_FILES);
      })

  );

  self.skipWaiting();

});


/* =========================================================
   AKTIVIERUNG
   Alte Cache-Versionen entfernen
   ========================================================= */

self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches
      .keys()
      .then((cacheNames) => {

        return Promise.all(

          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME;
            })
            .map((cacheName) => {
              return caches.delete(cacheName);
            })

        );

      })
      .then(() => self.clients.claim())

  );

});


/* =========================================================
   DATEIEN LADEN
   Netzwerk bevorzugen, Cache als Rückfallebene
   ========================================================= */

self.addEventListener("fetch", (event) => {

  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(

    fetch(event.request)

      .then((response) => {

        const responseCopy =
          response.clone();

        caches
          .open(CACHE_NAME)
          .then((cache) => {
            cache.put(
              event.request,
              responseCopy
            );
          });

        return response;

      })

      .catch(() => {

        return caches.match(
          event.request
        );

      })

  );

});
