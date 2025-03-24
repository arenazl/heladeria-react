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
    icon: data.icon || '/logo192.png',
    badge: data.badge || '/logo192.png',
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

  // Get the base URL from the service worker scope
  const baseUrl = self.registration.scope;
  
  // Create a full URL by combining the base URL with the relative path
  // For HashRouter compatibility, we need to use the hash (#) in the URL
  const relativeUrl = event.notification.data.url || '/#/order-ready';
  
  // If the URL already contains the full path (including origin), use it directly
  const fullUrl = relativeUrl.startsWith('http') ? relativeUrl : baseUrl + (relativeUrl.startsWith('/') ? relativeUrl.substring(1) : relativeUrl);
  
  console.log('[Service Worker] Opening URL:', fullUrl);
  
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, focus it
        if (client.url.includes(relativeUrl) && 'focus' in client) {
          console.log('[Service Worker] Focusing existing client:', client.url);
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        console.log('[Service Worker] Opening new window with URL:', fullUrl);
        return clients.openWindow(fullUrl);
      }
    }).catch(error => {
      console.error('[Service Worker] Error handling notification click:', error);
    })
  );
});
