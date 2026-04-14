const CACHE_NAME = "ebook-cache-v1";

const urls = [
  "./",
  "index.html",
  "cap01.html",
  "cap02.html",
  "cap03.html",
  "cap04.html",
  "cap05.html",
  "cap06.html",
  "cap07.html",
  "cap08.html",
  "cap09.html",
  "cap10.html",
  "cap11.html",
  "cap12.html",
  "cap13.html",
  "cap14.html",
  "capa.jpg",
  "manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urls))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});