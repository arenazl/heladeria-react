import { API_CONFIG } from '../config/api.config';

/**
 * Generates a random estimated pickup time between 20-30 minutes from now
 * @returns Date object representing the estimated pickup time
 */
export const generateEstimatedPickupTime = (): Date => {
  const now = new Date();
  // Random minutes between 20 and 30
  const minutesToAdd = Math.floor(Math.random() * 11) + 20;
  const estimatedTime = new Date(now.getTime() + minutesToAdd * 60000);
  return estimatedTime;
};

/**
 * Formats a date to display the time in HH:MM format
 * @param date The date to format
 * @returns Formatted time string
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Calculates the time difference in minutes between two dates
 * @param date1 First date
 * @param date2 Second date
 * @returns Time difference in minutes
 */
export const getTimeDifferenceInMinutes = (date1: Date, date2: Date): number => {
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffMs / 60000);
};

/**
 * Requests permission for browser notifications
 * @returns Promise that resolves to the permission status
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  console.log('[Notification] Checking if browser supports notifications');
  if (!('Notification' in window)) {
    console.error('[Notification] This browser does not support desktop notification');
    return 'denied';
  }

  console.log('[Notification] Current permission status:', Notification.permission);
  if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    console.log('[Notification] Requesting permission...');
    const permission = await Notification.requestPermission();
    console.log('[Notification] Permission result:', permission);
    return permission;
  }

  return Notification.permission;
};

// Define VibratePattern type
type VibratePattern = number | number[];

// Extended notification options with mobile-specific properties
interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: VibratePattern;
  badge?: string;
}

/**
 * Sends a browser notification
 * @param title Notification title
 * @param options Notification options
 * @returns The notification object if successful, null otherwise
 */
export const sendNotification = (title: string, options?: NotificationOptions): Notification | null => {
  console.log('[Notification] Attempting to send notification:', title);
  
  if (!('Notification' in window)) {
    console.error('[Notification] Notification API not available in this browser');
    return null;
  }
  
  console.log('[Notification] Permission status:', Notification.permission);
  if (Notification.permission !== 'granted') {
    console.error('[Notification] Permission not granted, cannot send notification');
    return null;
  }

  // Set default options for better mobile experience
  const defaultOptions: ExtendedNotificationOptions = {
              icon: '/logo192.png',
    badge: API_CONFIG.COMPANY_ID, // For Android
    vibrate: [200, 100, 200], // Vibration pattern for mobile devices
    requireInteraction: true, // Keep notification until user interacts with it
    ...options
  };
  
  console.log('[Notification] Using options:', defaultOptions);

  // Check if this is a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  console.log('[Notification] Device type:', isMobile ? 'Mobile' : 'Desktop');
  
  try {
    // For mobile devices, prefer service worker notifications
    if (isMobile && 'serviceWorker' in navigator) {
      console.log('[Notification] Mobile device with Service Worker API available, using service worker notification');
      
      try {
        // Return a promise that will resolve to a mock notification object
        const notificationPromise = new Promise<Notification | null>((resolve) => {
          navigator.serviceWorker.ready.then(registration => {
            console.log('[Notification] Service Worker ready, showing notification');
            
            // Add data for navigation when notification is clicked
            // Use full URL for better compatibility with PWAs
            const baseUrl = window.location.origin;
            const notificationOptions = {
              ...defaultOptions,
              data: {
                url: `${baseUrl}/#/order-ready` // Use hash for HashRouter compatibility
              }
            };
            
            registration.showNotification(title, notificationOptions).then(() => {
              console.log('[Notification] Service Worker notification shown successfully');
              
              // Create a mock notification object to return
              const mockNotification = new EventTarget() as Notification;
              mockNotification.onclick = () => console.log('[Notification] Mock notification clicked');
              
              resolve(mockNotification as Notification);
            }).catch(err => {
              console.error('[Notification] Service Worker notification failed:', err);
              console.log('[Notification] Falling back to standard notification');
              resolve(null);
            });
          }).catch(err => {
            console.error('[Notification] Service Worker not ready:', err);
            console.log('[Notification] Falling back to standard notification');
            resolve(null);
          });
        });
        
        // Return a mock notification object immediately
        const mockNotification = new EventTarget() as Notification;
        mockNotification.onclick = () => console.log('[Notification] Mock notification clicked');
        return mockNotification as Notification;
      } catch (swError) {
        console.error('[Notification] Service Worker error:', swError);
        console.log('[Notification] Falling back to standard notification');
      }
    } else {
      // For desktop browsers, use standard notification API
      console.log('[Notification] Using standard notification API');
      
      try {
        console.log('[Notification] Attempting to create standard notification');
        const notification = new Notification(title, defaultOptions);
        console.log('[Notification] Standard notification created successfully');
        
        // Log notification events
        notification.onshow = () => console.log('[Notification] Notification shown to user');
        notification.onclick = () => console.log('[Notification] Notification clicked by user');
        notification.onclose = () => console.log('[Notification] Notification closed by user');
        notification.onerror = (e) => console.error('[Notification] Notification error:', e);
        
        return notification;
      } catch (notificationError) {
        console.error('[Notification] Standard notification failed:', notificationError);
        console.log('[Notification] Notification may not be supported in this browser/device');
        return null;
      }
    }
  } catch (error) {
    // Log detailed error information
    console.error('[Notification] Unexpected error during notification process:', error);
    return null;
  }
  
  // Default return if no notification method was successful
  return null;
};

/**
 * Schedules a notification to be sent at a specific time
 * @param title Notification title
 * @param scheduledTime Time to send the notification
 * @param options Notification options
 * @returns Timeout ID for the scheduled notification
 */
export const scheduleNotification = (
  title: string,
  scheduledTime: Date,
  options?: NotificationOptions
): number => {
  const now = new Date();
  const timeUntilNotification = scheduledTime.getTime() - now.getTime();
  
  if (timeUntilNotification <= 0) {
    // If the scheduled time is in the past, send immediately
    sendNotification(title, options);
    return 0;
  }
  
  // Schedule the notification
  return window.setTimeout(() => {
    sendNotification(title, options);
  }, timeUntilNotification);
};
