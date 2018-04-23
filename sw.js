const CACHE_NAME = 'blacklistr-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/main.js',
  '/js/buttons.js',
  '/js/countries.js',
  '/assets/boundaries.js',
  '/assets/codes.min.js'
];

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      const fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(
        response => {
          if (!response || response.status !== 200 || response.type !== 'basic') return response;
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        }
      );
    })
  );
});
