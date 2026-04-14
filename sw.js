const CACHE_NAME = "ebook-cache-v2"; // 👈 MUDE ISSO A CADA UPDATE

const urlsToCache = [
  "./",
  "index.html",
  "style.css",

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
  "manifest.json",
  "icon.png"
];

// 🔥 INSTALA E FORÇA NOVA VERSÃO
self.addEventListener("install", (event) => {
  self.skipWaiting(); // ativa nova versão imediatamente

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 🔥 LIMPA CACHE ANTIGO AUTOMATICAMENTE
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
      self.clients.claim() // assume controle imediato
    ])
  );
});

// 🔥 ESTRATÉGIA INTELIGENTE DE CACHE
self.addEventListener("fetch", (event) => {
  const req = event.request;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // atualiza cache em background
        const resClone = res.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, resClone);
        });

        return res;
      })
      .catch(() => {
        // fallback offline
        return caches.match(req);
      })
  );
});