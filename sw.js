// ═══════════════════════════════════════════════════════════
// Service Worker pour StudyFlow — Cache offline basique
// ═══════════════════════════════════════════════════════════

const CACHE_NAME = 'studyflow-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/auth.css',
  './css/todo.css',
  './css/groupe.css',
  './css/chat.css',
  './css/js/app.js',
  './css/js/auth.js',
  './css/js/todo.js',
  './css/js/groupe.js',
  './css/js/chat.js'
];

// ──────────────────────────────────────────────────────────
// INSTALLATION : mettre en cache les ressources essentielles
// ──────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('🔧 Installation du Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Mise en cache des ressources');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// ──────────────────────────────────────────────────────────
// FETCH : servir depuis le cache si disponible
// ──────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourner depuis le cache si trouvé
        if (response) {
          return response;
        }
        // Sinon, faire la requête réseau
        return fetch(event.request);
      })
  );
});

// ──────────────────────────────────────────────────────────
// ACTIVATE : nettoyer les anciens caches
// ──────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('✅ Activation du Service Worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});