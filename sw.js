// Service Worker for PWA
const CACHE_NAME = 'klmaterial-v24';
const APP_SCOPE = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const appUrl = (path = '') => `${APP_SCOPE}${path ? `/${path.replace(/^\//, '')}` : '/'}`;
const urlsToCache = [
  appUrl('kl-liquid-glass.css'),
  appUrl(),
  appUrl('index.html'),
  appUrl('materials.html'),
  appUrl('roadmap.html'),
  appUrl('about.html'),
  appUrl('contact.html'),
  appUrl('cgpa.html'),
  appUrl('privacy.html'),
  appUrl('offline.html'),
  appUrl('404.html'),
  appUrl('style.css'),
  appUrl('ui.js'),
  appUrl('advanced-features.js'),
  appUrl('fantasy-effects.js'),
  appUrl('animations.js'),
  appUrl('chatbot.js'),
  appUrl('github-materials.js'),
  appUrl('supabase-db.js'),
  appUrl('cookie-consent.js'),
  appUrl('study-timer.js'),
  appUrl('assets/profile.jpg'),
  appUrl('icon.svg'),
  appUrl('manifest.json'),
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch with Network First, Cache Fallback strategy
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }

          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match(appUrl('offline.html'));
          }
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implement data sync logic here
  console.log('Syncing data...');
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: appUrl('icon.svg'),
    badge: appUrl('icon.svg'),
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'View Materials'
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('KL Material', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(appUrl('materials.html'))
    );
  }
});
