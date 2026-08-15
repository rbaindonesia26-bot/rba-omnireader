const CACHE_NAME = 'rba-omnireader-pwa-v13';
const urlsToCache = [
  '/rba-omnireader/',
  '/rba-omnireader/index.html',
  '/rba-omnireader/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Memaksa update mesin baru
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName); // Hapus memori lama
        })
      );
    })
  );
});

// Strategi Network-First: Selalu utamakan kode internet terbaru daripada memori lama
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
