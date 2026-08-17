const CACHE_NAME = 'body-metrica-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/robots.txt',
  '/offline.html',
  '/favicon.ico'
];

let notificationSettings = null;

// Google Fonts and external resources patterns
const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com';
const GOOGLE_FONTS_STATIC_URL = 'https://fonts.gstatic.com';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-cache core shell
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and Supabase API calls
  if (event.request.method !== 'GET' || url.hostname.includes('supabase.co')) return;

  // Stale-while-revalidate for critical assets (CSS, Fonts, Images)
  const isCritical = 
    url.pathname.endsWith('.css') || 
    url.pathname.endsWith('.js') ||
    url.origin === GOOGLE_FONTS_URL ||
    url.origin === GOOGLE_FONTS_STATIC_URL ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff2)$/);

  if (isCritical) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchedResponse = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => null);

          return cachedResponse || fetchedResponse;
        });
      })
    );
    return;
  }

  // Cache-first for the rest (default behavior)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          return null;
        });
    })
  );
});

// Notification scheduling logic
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_NOTIFICATION_SETTINGS') {
    notificationSettings = event.data.settings;
    console.log('[SW] Notification settings updated:', notificationSettings);
    
    // In a real environment, we'd use Periodic Sync or server-side push.
    // Since we are simulating, we'll use a simple interval check while the SW is active.
    setupSimulatedReminders();
  }
});

let reminderInterval = null;
function setupSimulatedReminders() {
  if (reminderInterval) clearInterval(reminderInterval);
  
  // Check every minute
  reminderInterval = setInterval(() => {
    if (!notificationSettings) return;
    
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Check hydration times
    if (notificationSettings.hydration.enabled) {
      if (notificationSettings.hydration.times.includes(currentTime)) {
        showHydrationReminder();
      }
    }
    
    // Check macro times
    if (notificationSettings.macros.enabled) {
      if (notificationSettings.macros.times.includes(currentTime)) {
        showMacroReminder();
      }
    }
  }, 60000);
}

function showHydrationReminder() {
  self.registration.showNotification('Body Métrica FJ', {
    body: 'Hora de se hidratar! Mantenha sua performance alta.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'hydration-reminder',
    data: { url: '/hydration' }
  });
}

function showMacroReminder() {
  self.registration.showNotification('Body Métrica FJ', {
    body: 'Não esqueça de registrar suas refeições e bater seus macros.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'macro-reminder',
    data: { url: '/nutrition' }
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
