/* Diario de fierros: guarda la app en el dispositivo para que abra sin conexión.
   Este archivo se genera solo. El nombre de la versión cambia cuando cambia cualquier archivo de la app. */
const VERSION = "fierros-455ab33f88";
const ARCHIVOS = [
  "./",
  "index.html",
  "manifest.json",
  "fonts/archivo.woff2",
  "fonts/chivo.woff2",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "img/curl-alternado-a.webp",
  "img/curl-alternado-b.webp",
  "img/curl-concentrado-a.webp",
  "img/curl-concentrado-b.webp",
  "img/curl-cruzado-a.webp",
  "img/curl-cruzado-b.webp",
  "img/curl-martillo-a.webp",
  "img/curl-martillo-b.webp",
  "img/curl-zottman-a.webp",
  "img/curl-zottman-b.webp",
  "img/press-hombro-a.webp",
  "img/press-hombro-b.webp",
  "img/press-pecho-a.webp",
  "img/press-pecho-b.webp",
  "img/remo-un-brazo-a.webp",
  "img/remo-un-brazo-b.webp",
  "img/rusa-curl-doble-a.webp",
  "img/rusa-curl-doble-b.webp",
  "img/rusa-elevaciones-laterales-a.webp",
  "img/rusa-elevaciones-laterales-b.webp",
  "img/rusa-molino-a.webp",
  "img/rusa-molino-b.webp",
  "img/rusa-patada-triceps-a.webp",
  "img/rusa-patada-triceps-b.webp",
  "img/rusa-peso-muerto-una-pierna-a.webp",
  "img/rusa-peso-muerto-una-pierna-b.webp",
  "img/rusa-press-alternado-a.webp",
  "img/rusa-press-alternado-b.webp",
  "img/rusa-press-militar-a.webp",
  "img/rusa-press-militar-b.webp",
  "img/rusa-remo-doble-a.webp",
  "img/rusa-remo-doble-b.webp",
  "img/rusa-sentadilla-frontal-a.webp",
  "img/rusa-sentadilla-frontal-b.webp",
  "img/rusa-swing-a.webp",
  "img/rusa-swing-b.webp",
  "img/sentadilla-sumo-a.webp",
  "img/sentadilla-sumo-b.webp",
  "img/triceps-tras-nuca-a.webp",
  "img/triceps-tras-nuca-b.webp"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith('fierros-') && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    // La página abre al instante con lo guardado y se actualiza por detrás para la próxima vez.
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      const guardada = await c.match('index.html');
      const red = fetch(req).then((r) => { if (r && r.ok) c.put('index.html', r.clone()); return r; });
      if (guardada) { e.waitUntil(red.catch(() => {})); return guardada; }
      return red;
    })());
    return;
  }
  e.respondWith(
    caches.match(req).then((guardado) => guardado || fetch(req).then((r) => {
      if (r && r.ok) { const copia = r.clone(); caches.open(VERSION).then((c) => c.put(req, copia)); }
      return r;
    }))
  );
});
