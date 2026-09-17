const CACHE = 'sarit-songbook-v9';
const ASSETS = ['./', './index.html', './styles.css', './platforms.css?v=9', './icons.svg?v=9', './app.js?v=9', './songs.js', './setlist.js', './manifest.webmanifest', './favicon.png', './apple-touch-icon.png', './icon-192.png', './icon-512.png', './rubik-vf.ttf'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return response;
  }).catch(() => caches.match('./index.html'))));
});
