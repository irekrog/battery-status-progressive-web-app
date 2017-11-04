/* eslint no-console: 0 */

const CACHE_NAME = 'v2:cache';

let toCache = [
  './',
  './css/material.min.css',
  './css/main.css',
  './js/material.min.js',
  './js/script.js',
  './images/battery.png',
  './manifest.json',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(toCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response || fetch(event.request))
  );
});
