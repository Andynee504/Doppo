importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  // Make the new service worker take control immediately (MVP convenience)
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
  workbox.core.clientsClaim();

  // Precache static assets (simple MVP revisions)
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: 'v1' },
    { url: '/index.html', revision: 'v1' },
    { url: '/manifest.json', revision: 'v1' },
    { url: '/css/main.css', revision: 'v1' },
    { url: '/js/main.js', revision: 'v1' },
    { url: '/icons/icon-192x192.png', revision: 'v1' },
    { url: '/icons/icon-512x512.png', revision: 'v1' }
    // other assets here later
  ]);

  // Runtime caching: images (Cache First with expiration)
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache-v1',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 // 1 hour
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );

  // Runtime caching: navigation (Network First) to prefer fresh HTML
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache-v1',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 20 })
      ]
    })
  );

  // Fallback for other requests: StaleWhileRevalidate for CSS/JS
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources-v1'
    })
  );
} else {
  // Workbox failed to load - minimal fallback behaviour
  self.addEventListener('install', (event) => self.skipWaiting());
  self.addEventListener('activate', (event) => workbox?.core?.clientsClaim?.());
}