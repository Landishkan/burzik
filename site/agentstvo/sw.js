// Прежний адрес /agentstvo/ больше не используется: убираем старый офлайн-кэш и перенаправляем на главную.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('agentstvo-')).map(k => caches.delete(k)));
    await self.registration.unregister();
    const list = await self.clients.matchAll({ type: 'window' });
    list.forEach(c => c.navigate('../'));
  })());
});
