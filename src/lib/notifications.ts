import { isBrowser, safeLocalStorage } from "./browser-utils";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import React from "react";
import { addNotificationLog } from "./notification-history";

export interface NotificationSettings {
  hydration: {
    enabled: boolean;
    times: string[];
    frequency: 'daily' | 'custom';
    threshold: number; // e.g., 0.2 means 20% left
    sensitivity: 'low' | 'medium' | 'high';
  };
  macros: {
    enabled: boolean;
    times: string[];
    frequency: 'daily' | 'custom';
    delayWindow: number; // in minutes
  };
  dailySummary: {
    enabled: boolean;
    time: string;
  };
  weeklySummary: {
    enabled: boolean;
    weekday: number; // 0 = Domingo ... 6 = Sábado
    time: string;
  };
  adherence: {
    enabled: boolean;
    frequency: 'weekly' | 'daily';
  };
  weeklyReports: boolean;
}

const SETTINGS_KEY = 'bodymetrica_notification_settings';

const DEFAULT_SETTINGS: NotificationSettings = {
  hydration: {
    enabled: true,
    times: ['08:00', '14:00', '20:00'],
    frequency: 'daily',
    threshold: 0.2,
    sensitivity: 'medium'
  },
  macros: {
    enabled: true,
    times: ['12:00', '19:00'],
    frequency: 'daily',
    delayWindow: 15
  },
  dailySummary: {
    enabled: true,
    time: '21:30'
  },
  adherence: {
    enabled: true,
    frequency: 'daily'
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
  if (!isBrowser) return;
  
  const settings = getNotificationSettings();
  if (!settings.hydration.enabled && !settings.macros.enabled) return;

  const permission = await requestNotificationPermission();
  if (!permission) return;

  // In a real PWA context with service workers:
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      registration.active.postMessage({
        type: 'SET_NOTIFICATION_SETTINGS',
        settings
      });
    }
  }

  // Local scheduling logic (simulated for the demo)
  console.log("Notificações agendadas localmente:", settings);
  
  // Example of immediate check for "near not being reached"
  // In a real app, this would be a background task or push notification
  const checkGoals = (stats?: { hydrationPercent: number, adherencePercent: number }) => {
    // Threshold for warnings: 80% (close to missing)
    if (stats) {
      if (stats.hydrationPercent < 80 && new Date().getHours() > 18) {
        toast.custom((t) => React.createElement(SVGToast, {
            type: "warning",
            title: "PERFORMANCE EM RISCO",
            message: `Você atingiu apenas ${stats.hydrationPercent}% da meta de hidratação hoje. Hidrate-se agora!`,
            onClose: () => toast.dismiss(t)
        }), { duration: 6000 });
        
        sendImmediateNotification("Performance em Risco", {
          body: `Você atingiu apenas ${stats.hydrationPercent}% da meta de hidratação hoje. Hidrate-se agora!`,
        });
      }
      
      if (stats.adherencePercent < 60) {
        toast.custom((t) => React.createElement(SVGToast, {
            type: "info",
            title: "ATENÇÃO À CONSISTÊNCIA",
            message: `Sua adesão semanal está em ${stats.adherencePercent}%. Ajuste seu foco para bater as metas amanhã.`,
            onClose: () => toast.dismiss(t)
        }), { duration: 6000 });
        
        sendImmediateNotification("Atenção à Consistência", {
          body: `Sua adesão semanal está em ${stats.adherencePercent}%. Ajuste seu foco para bater as metas amanhã.`,
        });
      }
    }
  };

  const scheduleMealReminders = () => {
    // Logic to set intervals for meals based on current user settings
    console.log("Scheduling meal reminders...");
  };

  const scheduleDailySummary = () => {
    const settings = getNotificationSettings();
    if (!settings.dailySummary.enabled) return;
    console.log(`Scheduling daily summary for ${settings.dailySummary.time}`);
  };

  const checkMealProgress = (meal: string) => {
    // Logic to check if user has confirmed meal X
    console.log(`Checking progress for: ${meal}`);
  };

  scheduleMealReminders();
  scheduleDailySummary();


  // Run initial check
  checkGoals();
  
  // Setup periodic check every 30 mins while app is open
  setInterval(checkGoals, 30 * 60 * 1000);
};

export const sendImmediateNotification = async (title: string, options?: NotificationOptions) => {
  if (!isBrowser) return;

  // Log the notification attempt
  addNotificationLog({
    title,
    type: title.toLowerCase().includes('hidratação') ? 'hydration' : 
          title.toLowerCase().includes('resumo') ? 'summary' : 'macro',
    status: Notification.permission === 'granted' ? 'sent' : 'pending'
  });

  if (Notification.permission !== 'granted') return;
  
  const registration = await navigator.serviceWorker.ready;
  if (registration && 'showNotification' in registration) {
    registration.showNotification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      ...options
    });
  } else {
    new Notification(title, options);
  }
};

export const testDailySummary = async () => {
  const settings = getNotificationSettings();
  const summaryTitle = "RESUMO DIÁRIO DE PERFORMANCE";
  const summaryBody = "Seus registros de hoje: 2.1L de água (70%), 145g de proteína (80%). Pendência: Jantar ainda não registrado.";
  
  toast.custom((t) => React.createElement(SVGToast, {
    type: "info",
    title: summaryTitle,
    message: summaryBody,
    onClose: () => toast.dismiss(t)
  }), { duration: 6000 });

  await sendImmediateNotification(summaryTitle, {
    body: summaryBody,
  });
};
