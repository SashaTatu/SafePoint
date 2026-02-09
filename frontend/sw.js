self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body,
    icon: data.icon || '/frontend/assets/icons/192x192.png',
    badge: '/frontend/assets/icons/128x128.png', // Спрощена біла іконка для Android
    tag: 'alarm-notification',       // Однаковий тег дозволяє замінювати старі повідомлення
    renotify: true,                  // Змушує телефон вібрувати навіть при заміні повідомлення
    vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40], // Кастомний малюнок вібрації
    data: {
      url: data.data?.url || '/'
    },
    actions: [
      { action: 'open', title: 'Відкрити застосунок' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const action = event.action;

  notification.close();

  // Логіка переходу за посиланням
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Якщо вкладка вже відкрита — фокусуємося на ній
      for (const client of clientList) {
        if (client.url === notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Якщо ні — відкриваємо нову
      if (clients.openWindow) {
        return clients.openWindow(notification.data.url);
      }
    })
  );
});