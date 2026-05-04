// ═══════════════════════════════════════════════════════════
// Service Worker pour StudyFlow — Cache avancé + Sync
// ═══════════════════════════════════════════════════════════

const CACHE_NAME = 'studyflow-v2';
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
// INSTALLATION : mise en cache des ressources essentielles
// ──────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('🔧 Installation SW v2 - Cache avancé');
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
// FETCH : stratégie de cache avancée
// ──────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  // Pour les requêtes de données (API futures), utiliser Network First
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Mettre en cache les réponses réussies
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // En cas d'échec réseau, essayer le cache
          return caches.match(event.request);
        })
    );
  } else {
    // Pour les ressources statiques, Cache First
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(response => {
            // Ne pas mettre en cache les erreurs
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return response;
          });
        })
    );
  }
});

// ──────────────────────────────────────────────────────────
// SYNCHRONISATION EN ARRIÈRE-PLAN
// ──────────────────────────────────────────────────────────
self.addEventListener('sync', event => {
  console.log('🔄 Sync en arrière-plan:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(syncDataInBackground());
  }
});

// ──────────────────────────────────────────────────────────
// MESSAGES DU MAIN THREAD
// ──────────────────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'SYNC_DATA') {
    syncDataInBackground();
  }
});

// ──────────────────────────────────────────────────────────
// FONCTION DE SYNCHRONISATION
// ──────────────────────────────────────────────────────────
async function syncDataInBackground() {
  try {
    console.log('🔄 Synchronisation des données...');

    // Ici, on pourrait synchroniser avec un serveur distant
    // Pour l'instant, on simule une synchronisation réussie

    // Notification de succès (si permissions accordées)
    if ('Notification' in self && Notification.permission === 'granted') {
      self.registration.showNotification('StudyFlow', {
        body: 'Données synchronisées avec succès !',
        icon: './icons/icon-192x192.png',
        badge: './icons/icon-192x192.png'
      });
    }

    console.log('✅ Synchronisation terminée');
  } catch (error) {
    console.error('❌ Erreur de synchronisation:', error);
  }
}

// ──────────────────────────────────────────────────────────
// NETTOYAGE DES ANCIENS CACHES
// ──────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('✅ Activation SW v2');
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
    }).then(() => {
      self.clients.claim();
      // Déclencher une synchronisation au démarrage
      return syncDataInBackground();
    })
  );
});

// ──────────────────────────────────────────────────────────
// NOTIFICATIONS PUSH (PRÊT POUR PLUS TARD)
// ──────────────────────────────────────────────────────────
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: data.data
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'StudyFlow', options)
    );
  }
});

// ──────────────────────────────────────────────────────────
// CLIC SUR NOTIFICATION
// ──────────────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});