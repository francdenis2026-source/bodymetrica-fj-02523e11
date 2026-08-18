import { safeLocalStorage } from "./browser-utils";

export interface DailyAdherence {
  date: string;
  macros: number; // 0-100 percentage
  water: number;  // 0-100 percentage
  training: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: 'meal' | 'goal' | 'weight' | 'adherence';
}

const ADHERENCE_KEY = 'bodymetrica_adherence_data';
const AUDIT_KEY = 'bodymetrica_audit_logs';

export const getAdherenceData = (): DailyAdherence[] => {
  const saved = safeLocalStorage.getItem(ADHERENCE_KEY);
  if (!saved) {
    return [
      { date: '2026-08-12', macros: 85, water: 90, training: true },
      { date: '2026-08-13', macros: 60, water: 45, training: false },
      { date: '2026-08-14', macros: 95, water: 100, training: true },
      { date: '2026-08-15', macros: 88, water: 80, training: true },
      { date: '2026-08-16', macros: 100, water: 100, training: false },
      { date: '2026-08-17', macros: 75, water: 70, training: true },
      { date: '2026-08-18', macros: 92, water: 85, training: true },
    ];
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
};

export const saveAdherenceRecord = (record: DailyAdherence) => {
  const current = getAdherenceData();
  const index = current.findIndex(r => r.date === record.date);
  const oldRecord = index >= 0 ? current[index] : null;

  if (index >= 0) {
    current[index] = record;
  } else {
    current.push(record);
  }
  safeLocalStorage.setItem(ADHERENCE_KEY, JSON.stringify(current));

  addAuditLog({
    action: index >= 0 ? 'Atualização de Aderência' : 'Novo Registro de Aderência',
    details: `Data: ${record.date} | Macros: ${record.macros}% | Água: ${record.water}%${oldRecord ? ` (Anterior: ${oldRecord.macros}% / ${oldRecord.water}%)` : ''}`,
    type: 'adherence'
  });
};

export const getAuditLogs = (): AuditLog[] => {
  const saved = safeLocalStorage.getItem(AUDIT_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
};

export const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    ...log,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString()
  };
  logs.unshift(newLog);
  // Keep last 100 logs
  safeLocalStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, 100)));
};
