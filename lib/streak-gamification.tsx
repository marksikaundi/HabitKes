import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "habitkes_streak_gamification_v1";

export type MilestoneDef = {
  days: number;
  sparkBonus: number;
  title: string;
  subtitle: string;
};

/** Bonus tiers — tune copy and points anytime */
export const STREAK_MILESTONES: MilestoneDef[] = [
  {
    days: 3,
    sparkBonus: 15,
    title: "Bronze spark",
    subtitle: "Three days showing up — that compounds fast.",
  },
  {
    days: 7,
    sparkBonus: 40,
    title: "Week warrior",
    subtitle: "A full week in the app. Your streak is real.",
  },
  {
    days: 14,
    sparkBonus: 100,
    title: "Fortnight focus",
    subtitle: "Two weeks of consistency unlocks serious momentum.",
  },
  {
    days: 30,
    sparkBonus: 250,
    title: "Monthly legend",
    subtitle: "Rare air — most people never make it here.",
  },
];

export type StreakSnapshot = {
  lastVisitDate: string | null;
  currentStreak: number;
  bestStreak: number;
  sparkPoints: number;
  /** Milestone `days` values already rewarded for the current streak run */
  milestonesClaimedThisRun: number[];
};

const defaultSnapshot: StreakSnapshot = {
  lastVisitDate: null,
  currentStreak: 0,
  bestStreak: 0,
  sparkPoints: 0,
  milestonesClaimedThisRun: [],
};

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Local calendar day key — avoids UTC drift */
export function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return localDateKey(d);
}

type GamificationContextValue = {
  loaded: boolean;
  snapshot: StreakSnapshot;
  /** Set after a new visit awards a milestone — show celebration modal */
  pendingMilestone: MilestoneDef | null;
  dismissPendingMilestone: () => void;
};

const GamificationContext = createContext<GamificationContextValue | null>(
  null,
);

export function StreakGamificationProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [snapshot, setSnapshot] = useState<StreakSnapshot>(defaultSnapshot);
  const [pendingMilestone, setPendingMilestone] = useState<MilestoneDef | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        let s: StreakSnapshot = raw
          ? { ...defaultSnapshot, ...safeParse(raw) }
          : { ...defaultSnapshot };

        const today = localDateKey(new Date());

        if (s.lastVisitDate === today) {
          if (!cancelled) {
            setSnapshot(s);
            setLoaded(true);
          }
          return;
        }

        const yKey = yesterdayKey();
        let milestonesClaimed = [...s.milestonesClaimedThisRun];

        if (s.lastVisitDate === null) {
          s.currentStreak = 1;
          milestonesClaimed = [];
        } else if (s.lastVisitDate === yKey) {
          s.currentStreak += 1;
        } else {
          s.currentStreak = 1;
          milestonesClaimed = [];
        }

        s.lastVisitDate = today;
        s.bestStreak = Math.max(s.bestStreak, s.currentStreak);

        let pending: MilestoneDef | null = null;

        for (const m of STREAK_MILESTONES) {
          if (
            s.currentStreak === m.days &&
            !milestonesClaimed.includes(m.days)
          ) {
            s.sparkPoints += m.sparkBonus;
            milestonesClaimed.push(m.days);
            pending = m;
            break;
          }
        }

        s.milestonesClaimedThisRun = milestonesClaimed;

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(s));

        if (!cancelled) {
          setSnapshot(s);
          if (pending) {
            setPendingMilestone(pending);
          }
          setLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setSnapshot({ ...defaultSnapshot });
          setLoaded(true);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  const dismissPendingMilestone = useCallback(() => {
    setPendingMilestone(null);
  }, []);

  const value = useMemo<GamificationContextValue>(
    () => ({
      loaded,
      snapshot,
      pendingMilestone,
      dismissPendingMilestone,
    }),
    [loaded, snapshot, pendingMilestone, dismissPendingMilestone],
  );

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

function safeParse(raw: string): Partial<StreakSnapshot> {
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    return {
      lastVisitDate:
        typeof o.lastVisitDate === "string" || o.lastVisitDate === null
          ? (o.lastVisitDate as string | null)
          : null,
      currentStreak:
        typeof o.currentStreak === "number" ? o.currentStreak : 0,
      bestStreak: typeof o.bestStreak === "number" ? o.bestStreak : 0,
      sparkPoints: typeof o.sparkPoints === "number" ? o.sparkPoints : 0,
      milestonesClaimedThisRun: Array.isArray(o.milestonesClaimedThisRun)
        ? (o.milestonesClaimedThisRun as number[]).filter(
            (n) => typeof n === "number",
          )
        : [],
    };
  } catch {
    return {};
  }
}

export function useStreakGamification(): GamificationContextValue {
  const ctx = useContext(GamificationContext);
  if (!ctx) {
    throw new Error(
      "useStreakGamification must be used within StreakGamificationProvider",
    );
  }
  return ctx;
}
