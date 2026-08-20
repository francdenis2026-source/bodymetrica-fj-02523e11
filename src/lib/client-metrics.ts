export type HydrationDay = {
  date: string;
  totalMl: number;
  entries: Array<{ amount: number; at: string }>;
};

const HYDRATION_KEY = "bodymetrica_hydration_v1";

function todayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getHydrationHistory(): HydrationDay[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HYDRATION_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getTodayHydration(): HydrationDay {
  const date = todayKey();
  return getHydrationHistory().find((item) => item.date === date) || { date, totalMl: 0, entries: [] };
}

export function addHydration(amount: number): HydrationDay {
  const safeAmount = Math.max(0, Math.min(Number(amount) || 0, 5000));
  const date = todayKey();
  const history = getHydrationHistory();
  const index = history.findIndex((item) => item.date === date);
  const current = index >= 0 ? history[index] : { date, totalMl: 0, entries: [] };
  const next: HydrationDay = {
    ...current,
    totalMl: Math.min(current.totalMl + safeAmount, 7000),
    entries: [...current.entries, { amount: safeAmount, at: new Date().toISOString() }],
  };

  const nextHistory = index >= 0
    ? history.map((item, itemIndex) => itemIndex === index ? next : item)
    : [...history, next];

  if (typeof window !== "undefined") {
    localStorage.setItem(HYDRATION_KEY, JSON.stringify(nextHistory.slice(-60)));
  }
  return next;
}

export function getHydrationWeek(goalMl = 3000) {
  const history = getHydrationHistory();
  const byDate = new Map(history.map((item) => [item.date, item.totalMl]));
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - offset));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const totalMl = byDate.get(key) || 0;
    return {
      date: key,
      totalMl,
      percentage: Math.min(100, Math.round((totalMl / goalMl) * 100)),
    };
  });
}

export function normalizeClientSession(session: any) {
  if (!session) return null;
  const nested = session.user && typeof session.user === "object" ? session.user : {};
  const profile = session.profile || nested.profile || {};
  return {
    ...nested,
    ...session,
    id: session.id || nested.id,
    email: session.email || nested.email,
    name: session.name || nested.name || profile.name || "Usuário",
    profile,
    licenseStatus: session.licenseStatus || nested.licenseStatus || profile.license_status || "pending",
    isLicensed: Boolean(session.isLicensed ?? nested.isLicensed ?? profile.license_status === "active"),
  };
}
