// Campus to Corporate Club (C3) - Service Worker (PWA Caching & Web Push)
const CACHE_VERSION = 'c3-portal-v2';
const OFFLINE_URL = '/offline.html';
const MAX_RUNTIME_ENTRIES = 60;
const MAX_CACHE_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/icons/icon-192.png?v=2',
  '/icons/icon-512.png?v=2',
  '/icons/icon-maskable-512.png?v=2',
  '/icons/apple-touch-icon.png?v=2',
  '/favicon.ico?v=2',
];

// Helper: Trim runtime cache to ~60 entries and evict stale items older than 30 days
async function trimRuntimeCache(cache) {
  try {
    const keys = await cache.keys();
    const now = Date.now();

    // 1. Evict entries older than 30 days based on response Date header
    for (const req of keys) {
      const res = await cache.match(req);
      if (res) {
        const dateHeader = res.headers.get('date');
        if (dateHeader) {
          const resTime = new Date(dateHeader).getTime();
          if (!isNaN(resTime) && now - resTime > MAX_CACHE_AGE_MS) {
            await cache.delete(req);
          }
        }
      }
    }

    // 2. Cap total entries at MAX_RUNTIME_ENTRIES (protecting core shell files)
    const remainingKeys = await cache.keys();
    if (remainingKeys.length > MAX_RUNTIME_ENTRIES) {
      const toRemove = remainingKeys.length - MAX_RUNTIME_ENTRIES;
      for (let i = 0; i < toRemove; i++) {
        const keyUrl = new URL(remainingKeys[i].url);
        if (
          keyUrl.pathname !== OFFLINE_URL &&
          keyUrl.pathname !== '/manifest.webmanifest' &&
          !keyUrl.pathname.startsWith('/icons/')
        ) {
          await cache.delete(remainingKeys[i]);
        }
      }
    }
  } catch {}
}

// Install: Pre-cache offline fallback and core shell assets (waits for message to skip waiting)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
});

// Explicit skipWaiting on user message (avoids breaking active client with mismatched chunks)
self.addEventListener('message', (event) => {
  if (event.data && (event.data.type === 'SKIP_WAITING' || event.data === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});

// Activate: Delete outdated caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION) {
            return caches.delete(cacheName);
          }
          return null;
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Route requests by type
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle HTTP/HTTPS GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. NEVER cache backend API calls, cross-origin backend servers, or Render
  if (
    url.pathname.startsWith('/api') ||
    url.hostname.includes('onrender.com') ||
    url.port === '5000'
  ) {
    return;
  }

  // 2. Navigation requests (HTML pages): Network-first with offline.html fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(async () => {
        const cache = await caches.open(CACHE_VERSION);
        const cachedOffline = await cache.match(OFFLINE_URL);
        return cachedOffline || Response.error();
      })
    );
    return;
  }

  // 3. Static assets: Stale-While-Revalidate (Same-origin assets, icons, fonts, styles, scripts)
  const isSameOriginStatic =
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/icons/') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.woff2') ||
      url.pathname.endsWith('.woff') ||
      url.pathname.endsWith('.ttf') ||
      url.pathname === '/manifest.webmanifest' ||
      url.pathname === '/favicon.ico' ||
      url.pathname === OFFLINE_URL);

  const isExternalFont =
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('fontshare.com');

  if (isSameOriginStatic || isExternalFont) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(async (cache) => {
        const cachedResponse = await cache.match(req);

        const fetchPromise = fetch(req)
          .then((networkResponse) => {
            if (
              networkResponse &&
              (networkResponse.status === 200 || networkResponse.type === 'opaque')
            ) {
              cache.put(req, networkResponse.clone());
              // Trim cache asynchronously after storing
              trimRuntimeCache(cache);
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});

/* ==========================================================================
   Web Push Notification Event Handlers
   ========================================================================== */

self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'Campus to Corporate Club',
    body: 'New update from C3 Club!',
    icon: '/icons/icon-192.png?v=2',
    badge: '/icons/icon-192.png?v=2',
    data: { url: '/dashboard' },
  };

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch {
      notificationData.body = event.data.text();
    }
  }

  const title = notificationData.title || 'Campus to Corporate Club';
  const options = {
    body: notificationData.body,
    icon: notificationData.icon || '/icons/icon-192.png?v=2',
    badge: notificationData.badge || '/icons/icon-192.png?v=2',
    vibrate: [200, 100, 200, 100, 200],
    tag: notificationData.tag || 'c3-notification',
    renotify: true,
    data: notificationData.data || { url: '/dashboard' },
    actions: [{ action: 'view', title: 'Open C3 Portal' }],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client) {
            return client.navigate(targetUrl);
          }
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
