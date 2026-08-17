import { isBrowser, safeLocalStorage } from "./browser-utils";

export interface NotificationSettings {
  hydration: {
    enabled: boolean;
    times: string[];
    threshold: number; // e.g., 0.2 means 20% left
  };
  macros: {
    enabled: boolean;
    times: string[];
  };
  weeklyReports: boolean;
}

const SETTINGS_KEY = 'bodymetrica_notification_settings';

const DEFAULT_SETTINGS: NotificationSettings = {
  hydration: {
    enabled: true,
    times: ['08:00', '14:00', '20:00'],
    threshold: 0.2
  },
  macros: {
    enabled: true,
    times: ['12:00', '19:00']
  },
  weeklyReports: false
};

export const getNotificationSettings = (): NotificationSettings => {
  const saved = safeLocalStorage.getItem(SETTINGS_KEY);
  if (!saved) return DEFAULT_SETTINGS;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveNotificationSettings = (settings: NotificationSettings) => {
  safeLocalStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const requestNotificationPermission = async () => {
  if (!isBrowser || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const scheduleNotifications = async () => {
  if (!isBrowser || !('serviceWorker' in navigator)) return;
  
  const registration = await navigator.serviceWorker.ready;
  const settings = getNotificationSettings();
  
  // In a real PWA, we would use the Web Push API or at least the Notification API
  // but for periodic local reminders in a PWA, we can send the configuration to the SW.
  // Since real "scheduling" in browsers is limited without a server, 
  // we'll simulate the "automatic trigger when near not being reached" 
  // by checking current progress in the main thread and firing immediate notifications.
  
  // However, the SW can check these settings if we send them via message.
  if (registration.active) {
    registration.active.postMessage({
      type: 'SET_NOTIFICATION_SETTINGS',
      settings
    });
  }
};
