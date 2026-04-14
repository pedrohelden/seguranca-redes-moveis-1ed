const CACHE_NAME = "ebook-cache-v4";

// versao com suporte multi-language
// arquivos essenciais (shell do app)
const CORE_FILES = [
  "./",
  "/br/",
  "/en/",
  "/style.css",
  "/capa.jpg",
  "/icon.png",
  "/manifest.json"
];

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_FILES);
    })
  );
});

// ACTIVATE (remove cache antigo automaticamente)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      ),
      self.clients.claim()
    ])
  );
});

// FETCH (network-first + fallback offline)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // ignora requests externos
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const clone = res.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, clone);
        });

        return res;
      })
      .catch(() => caches.match(req))
  );
});