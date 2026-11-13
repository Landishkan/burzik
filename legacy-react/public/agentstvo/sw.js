// Офлайн для прототипа. Работает только со своим кэшем (agentstvo-*),
// чтобы не трогать кэш основного приложения на том же сайте.
const CACHE = 'agentstvo-v1';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('agentstvo-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function save(req, res) {
  const copy = res.clone();
  caches.open(CACHE).then(c => c.put(req, copy));
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Страница: сначала сеть, чтобы получать обновления; без сети — сохранённая копия
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => save('./index.html', res)).catch(() => caches.match('./index.html', { cacheName: CACHE })));
    return;
  }

  // Шрифты: сохраняются при первом заходе, потом берутся из кэша
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.match(req, { cacheName: CACHE }).then(hit => hit || fetch(req).then(res => save(req, res))));
  }
});
