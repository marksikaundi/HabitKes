import AsyncStorage from "@react-native-async-storage/async-storage";

import { localDateKey } from "@/lib/streak-gamification";

const STORAGE_KEY = "habora_daily_checkins_v1";
const PRUNE_DAYS = 120;

/** Minimal habit shape for recording — avoids importing accountability-board here */
export type HabitCheckInSnapshot = {
  completedToday: boolean;
};

export type DaySnapshot = {
  /** Habits completed that calendar day */
  c: number;
  /** Total habits tracked that day */
  t: number;
};

export type CheckInChartDay = {
  dateKey: string;
  weekdayShort: string;
  completed: number;
  total: number;
  /** True when we have a stored snapshot for this calendar day */
  hasSnapshot: boolean;
};

type StoreV1 = {
  v: 1;
  days: Record<string, DaySnapshot>;
};

const emptyStore: StoreV1 = { v: 1, days: {} };

function weekdayShort(d: Date): string {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()] ?? "";
}

/** Last `n` calendar days ending at `anchor` (inclusive), oldest first */
export function calendarDaysEndingAt(
  anchor: Date,
  n: number,
): Date[] {
  const out: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(
      anchor.getFullYear(),
      anchor.getMonth(),
      anchor.getDate() - i,
      12,
      0,
      0,
      0,
    );
    out.push(d);
  }
  return out;
}

function parseStore(raw: string | null): StoreV1 {
  if (!raw) {
    return { ...emptyStore, days: {} };
  }
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (o.v !== 1 || typeof o.days !== "object" || o.days === null) {
      return { ...emptyStore, days: {} };
    }
    const days: Record<string, DaySnapshot> = {};
    for (const [k, v] of Object.entries(o.days as Record<string, unknown>)) {
      if (typeof v !== "object" || v === null) continue;
      const rec = v as Record<string, unknown>;
      const c = typeof rec.c === "number" ? rec.c : 0;
      const t = typeof rec.t === "number" ? rec.t : 0;
      if (t > 0 && c >= 0 && c <= t) {
        days[k] = { c, t };
      }
    }
    return { v: 1, days };
  } catch {
    return { ...emptyStore, days: {} };
  }
}

function pruneOld(days: Record<string, DaySnapshot>): Record<string, DaySnapshot> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - PRUNE_DAYS);
  const cutoffKey = localDateKey(cutoff);
  const next: Record<string, DaySnapshot> = {};
  for (const [key, snap] of Object.entries(days)) {
    if (key >= cutoffKey) {
      next[key] = snap;
    }
  }
  return next;
}

/**
 * Writes today's completion counts from the current habit list, persists, and
 * returns the last 7 calendar days for charting (oldest → newest).
 */
export async function persistTodayAndBuildWeekSeries(
  habits: HabitCheckInSnapshot[],
): Promise<CheckInChartDay[]> {
  const total = habits.length;
  const completed = habits.filter((h) => h.completedToday).length;
  const todayKey = localDateKey(new Date());

  let store = emptyStore;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    store = parseStore(raw);
  } catch {
    store = { ...emptyStore, days: {} };
  }

  if (total > 0) {
    store.days[todayKey] = {
      c: Math.min(completed, total),
      t: total,
    };
    store.days = pruneOld(store.days);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      /* still return computed series from memory */
    }
  } else {
    store.days = pruneOld(store.days);
  }

  const anchor = new Date();
  const row = calendarDaysEndingAt(anchor, 7);
  const currentTotal = Math.max(total, 1);

  return row.map((d) => {
    const key = localDateKey(d);
    const snap = store.days[key];
    const hasSnapshot = snap !== undefined && snap.t > 0;
    return {
      dateKey: key,
      weekdayShort: weekdayShort(d),
      completed: hasSnapshot ? snap.c : 0,
      total: hasSnapshot ? snap.t : currentTotal,
      hasSnapshot,
    };
  });
}
