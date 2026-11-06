// Service worker: lets the app open offline after the first visit.
// Strategy: try the network first (so your latest code always shows),
// and fall back to the saved copy when there is no connection.

const CACHE_NAME = 'study-me-v2';

const APP_FILES = [
  './',
  'index.html',
  'manifest.json',
  'css/style.css',
  'js/controller.js',
  'js/model.js',
  'js/pwa.js',
  'js/views/View.js',
  'js/views/FormView.js',
  'js/views/ListView.js',
  'js/views/NavView.js',
  'js/views/SummaryView.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

// 1. When installed, save the app files.
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

// 2. When activated, delete old saved copies.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(names =>
        Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
      )
  );
  self.clients.claim();
});

// 3. For each request: network first, saved copy as a backup.
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
