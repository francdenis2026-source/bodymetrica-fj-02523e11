import { safeLocalStorage } from "./browser-utils";

export interface NotificationLog {
  id: string;
  timestamp: string;
  title: string;
  type: 'hydration' | 'macro' | 'summary' | 'adherence';
  status: 'sent' | 'read' | 'pending';
}

const HISTORY_KEY = 'bodymetrica_notification_history';

export const getNotificationHistory = (): NotificationLog[] => {
  const saved = safeLocalStorage.getItem(HISTORY_KEY);
  if (!saved) {
    return [
      { id: '1', timestamp: '2026-08-18T08:00:00Z', title: 'Lembrete de Hidratação', type: 'hydration', status: 'read' },
      { id: '2', timestamp: '2026-08-18T12:00:00Z', title: 'Alerta de Proteína', type: 'macro', status: 'sent' },
      { id: '3', timestamp: '2026-08-18T19:00:00Z', title: 'Resumo Diário', type: 'summary', status: 'pending' },
    ];
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
};

export const addNotificationLog = (log: Omit<NotificationLog, 'id' | 'timestamp'>) => {
  const history = getNotificationHistory();
  const newLog: NotificationLog = {
    ...log,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  };
  history.unshift(newLog); // Newest first
  safeLocalStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50))); // Keep last 50
};
