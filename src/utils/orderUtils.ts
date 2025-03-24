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
  if (!('Notification' in window)) {
    console.error('This browser does not support desktop notification');
    return 'denied';
  }

  if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    return await Notification.requestPermission();
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
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return null;
  }

  // Set default options for better mobile experience
  const defaultOptions: ExtendedNotificationOptions = {
    icon: '/favicon.ico',
    badge: '/favicon.ico', // For Android
    vibrate: [200, 100, 200], // Vibration pattern for mobile devices
    requireInteraction: true, // Keep notification until user interacts with it
    ...options
  };

  try {
    // Try to use service worker for better mobile support if available
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, defaultOptions).catch(err => {
            console.log('Service worker notification failed, falling back to standard notification');
          });
        }).catch(err => {
          console.log('Service worker not ready, falling back to standard notification');
        });
      } catch (swError) {
        console.log('Service worker error, falling back to standard notification');
      }
    }
    
    // Always try to use the standard Notification API as fallback or primary method
    try {
      return new Notification(title, defaultOptions);
    } catch (notificationError) {
      console.log('Standard notification failed, notification may not be supported in this browser/device');
      return null;
    }
  } catch (error) {
    // Suppress console errors in production
    console.log('Notification error occurred, notifications may not be supported');
    return null;
  }
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
