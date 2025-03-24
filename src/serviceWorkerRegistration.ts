// Service worker registration for mobile notifications

// Check if service workers are supported
const isServiceWorkerSupported = 'serviceWorker' in navigator;

// Log service worker support status
console.log('[ServiceWorker] Service Worker supported:', isServiceWorkerSupported);

// Register the service worker
export function registerServiceWorker() {
  if (isServiceWorkerSupported) {
    console.log('[ServiceWorker] Attempting to register service worker');
    
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      
      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          console.log('[ServiceWorker] Service Worker registered successfully:', registration);
          
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // At this point, the updated precached content has been fetched,
                  // but the previous service worker will still serve the older
                  // content until all client tabs are closed.
                  console.log('[ServiceWorker] New content is available and will be used when all tabs for this page are closed');
                } else {
                  // At this point, everything has been precached.
                  // It's the perfect time to display a
                  // "Content is cached for offline use." message.
                  console.log('[ServiceWorker] Content is cached for offline use');
                }
              }
            };
          };
        })
        .catch(error => {
          console.error('[ServiceWorker] Error during service worker registration:', error);
        });
    });
  } else {
    console.log('[ServiceWorker] Service Workers are not supported in this browser');
  }
}

// Unregister the service worker
export function unregisterServiceWorker() {
  if (isServiceWorkerSupported) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
        console.log('[ServiceWorker] Service Worker unregistered');
      })
      .catch(error => {
        console.error('[ServiceWorker] Error unregistering service worker:', error);
      });
  }
}
