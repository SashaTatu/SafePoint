self.addEventListener('push', (event) => {
  let data = { title: 'Сповіщення', body: 'Нове повідомлення' };
  if (event.data) {
    try { data = event.data.json(); } catch (e) { data = { title: 'Сповіщення', body: event.data.text() }; }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge.png',
    data: data, // можна передавати payload для click
    requireInteraction: data.requireInteraction || false // якщо треба, щоб нотифікація не зникала
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
  event.waitUntil(clients.matchAll({ type: 'window' }).then( windowClients => {
    for (let client of windowClients) {
      if (client.url === url && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
