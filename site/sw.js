// Офлайн для Pixel. Страница и уроки берутся из сети, если она есть, иначе из сохранённой копии.
// Шрифты и иконки лежат в кэше и открываются сразу.
const CACHE = 'pixel-v1';
const SHELL = ['./', './index.html', './content.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './fonts/comfortaa-0-cyrillic.woff2',
  './fonts/comfortaa-1-latin.woff2',
  './fonts/m-plus-rounded-1c-2-cyrillic.woff2',
  './fonts/m-plus-rounded-1c-3-latin.woff2',
  './fonts/m-plus-rounded-1c-4-cyrillic.woff2',
  './fonts/m-plus-rounded-1c-5-latin.woff2',
  './fonts/m-plus-rounded-1c-6-cyrillic.woff2',
  './fonts/m-plus-rounded-1c-7-latin.woff2',
  './fonts/nunito-8-cyrillic.woff2',
  './fonts/nunito-9-latin.woff2',
  './fonts/press-start-2p-12-cyrillic.woff2',
  './fonts/press-start-2p-13-latin.woff2',
  './fonts/pt-mono-10-cyrillic.woff2',
  './fonts/pt-mono-11-latin.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

// удаляем всё, что осталось от прежних версий приложения
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function save(req, res) {
  if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // страница, уроки, манифест: сначала сеть, чтобы правки доходили сразу; без сети — копия
  if (req.mode === 'navigate' || /\.(js|html|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/')) {
    e.respondWith(fetch(req).then(res => save(req, res)).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html'))));
    return;
  }
  // всё остальное (шрифты, иконки): сначала копия
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => save(req, res))));
});
