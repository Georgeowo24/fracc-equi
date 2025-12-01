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
    './src/images/Logo.svg',
    './src/images/Logo.png',
    './src/images/Example.png',
    './src/images/icon-192.png',
    './src/images/icon-512.png',
    './src/images/AppWeb.png'
];

// Guardamos los archivos en caché
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Limpiamos cachés viejos si actualizas la versión
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
        return Promise.all(
            keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            })
        );
        })
    );
});

// Cuando el usuario pida una página se intentará servirla desde caché
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});