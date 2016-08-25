var CACHE_NAME = 'v1:cache';

var toCache = [
    './',
    './styles/material.min.css',
    './styles/main.css',
    './scripts/material.min.js',
    './scripts/script.js',
    './images/battery.png',
    './manifest.json',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(toCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});