import { safeLocalStorage } from "./browser-utils";

export interface DailyAdherence {
  date: string;
  macros: number; // 0-100 percentage
  water: number;  // 0-100 percentage
  training: boolean;
}

const ADHERENCE_KEY = 'bodymetrica_adherence_data';

export const getAdherenceData = (): DailyAdherence[] => {
  const saved = safeLocalStorage.getItem(ADHERENCE_KEY);
  if (!saved) {
    // Return some mock data for initial view if empty
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
  if (index >= 0) {
    current[index] = record;
  } else {
    current.push(record);
  }
  safeLocalStorage.setItem(ADHERENCE_KEY, JSON.stringify(current));
};
