// Service Worker for mobile notifications

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...', event);
  self.skipWaiting(); // Ensure service worker activates immediately
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker...', event);
  return self.clients.claim(); // Take control of all clients
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Notification received', event);

  const data = event.data ? event.data.json() : {};
  const title = data.title || '¡Tu pedido está listo!';
  const options = {
    body: data.body || 'Tu pedido está listo para retirar en mostrador.',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    vibrate: data.vibrate || [200, 100, 200],
    data: {
      url: data.url || '/order-ready'
    },
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received', event);

  event.notification.close();

  const url = event.notification.data.url || '/order-ready';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, focus it
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
