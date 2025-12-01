const CACHE_NAME = 'fracciones-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './training.html',
    './src/styles/global.css',
    './src/styles/index.css',
    './src/styles/splash.css',
    './src/styles/training.css',
    './src/JS/splash.js',
    './src/JS/training.js',
    './src/JS/localNotification.js',
    './src/JS/externalNotifications.js',
    './src/images/Logo.svg',
    './src/images/Logo.png',
    './src/images/Example.png',
    './src/images/icon-192.png',
    './src/images/icon-512.png',
    './src/images/AppWeb.png'
];

// 1. INSTALL
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. ACTIVATE
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
});

// 3. FETCH
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});

// 4. PUSH NOTIFICATION
self.addEventListener('push', (event) => {
    const data = event.data.json();
    console.log('Push recibido', data);

    self.registration.showNotification(data.title, {
        body: data.body,
        icon: './src/images/icon-192.png',
        badge: './src/images/Logo.png',
    });
});

// 5. NOTIFICATION CLICK
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = './training.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
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