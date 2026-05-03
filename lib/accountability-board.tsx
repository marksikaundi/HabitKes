import { createContext, createElement, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Client, Databases, ID } from 'appwrite';

import {
  persistTodayAndBuildWeekSeries,
  type CheckInChartDay,
} from '@/lib/daily-checkin-history';

export type ConnectionState = 'demo' | 'connecting' | 'live' | 'error';

export type Habit = {
  id: string;
  title: string;
  cadence: string;
  streak: number;
  bestStreak: number;
  completedToday: boolean;
  supporters: string[];
  color: string;
  progress: number;
};

export type Friend = {
  id: string;
  name: string;
  focus: string;
  status: string;
  avatar: string;
  live: boolean;
};

export type Activity = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: 'positive' | 'warning' | 'neutral';
};

export type AccountabilityBoard = {
  habits: Habit[];
  friends: Friend[];
  activity: Activity[];
  connectionState: ConnectionState;
  connectionLabel: string;
  servicesConfigured: boolean;
  /** Last 7 days (oldest → newest) for home analytics line chart */
  weekCheckInSeries: CheckInChartDay[];
  weekCheckInSeriesLoaded: boolean;
  toggleHabit: (habitId: string) => Promise<void>;
  addFriend: (name: string, focus: string) => Promise<void>;
  addActivity: (payload: { title: string; detail?: string }) => Promise<void>;
  refreshBoard: () => Promise<void>;
};

type AppwriteConfig = {
  endpoint: string;
  projectId: string;
  databaseId: string;
  habitsCollectionId: string;
  friendsCollectionId: string;
  activityCollectionId: string;
};

type Services = {
  client: Client;
  databases: Databases;
  config: AppwriteConfig;
};

const seedHabits: Habit[] = [
  {
    id: 'morning-run',
    title: 'Morning Preparation',
    cadence: 'Daily',
    streak: 12,
    bestStreak: 18,
    completedToday: true,
    supporters: ['Maya', 'Noor'],
    color: '#F97316',
    progress: 82,
  },
  {
    id: 'deep-work',
    title: 'Deep work block',
    cadence: 'Weekdays',
    streak: 6,
    bestStreak: 9,
    completedToday: false,
    supporters: ['Jules'],
    color: '#2563EB',
    progress: 61,
  },
  {
    id: 'hydrate',
    title: 'Hydration check',
    cadence: 'Daily',
    streak: 24,
    bestStreak: 24,
    completedToday: true,
    supporters: ['Ava', 'Theo', 'Priya'],
    color: '#10B981',
    progress: 94,
  },
];

const seedFriends: Friend[] = [
  {
    id: 'maya',
    name: 'Maya',
    focus: 'Morning workouts',
    status: 'Checked in 8 min ago',
    avatar: 'M',
    live: true,
  },
  {
    id: 'noor',
    name: 'Noor',
    focus: 'No-phone evenings',
    status: 'On a 9-day streak',
    avatar: 'N',
    live: true,
  },
  {
    id: 'jules',
    name: 'Jules',
    focus: 'Writing sprints',
    status: 'Needs a nudge today',
    avatar: 'J',
    live: false,
  },
];

const seedActivity: Activity[] = [
  {
    id: 'a1',
    title: 'Maya hit her run',
    detail: 'Shared a new morning streak update with the group.',
    time: '2 min ago',
    tone: 'positive',
  },
  {
    id: 'a2',
    title: 'Deep work reminder sent',
    detail: 'The board nudged Jules before his focus block.',
    time: '14 min ago',
    tone: 'warning',
  },
  {
    id: 'a3',
    title: 'Hydration streak locked',
    detail: 'Three friends reacted to the latest check-in.',
    time: '28 min ago',
    tone: 'neutral',
  },
];

const defaultConnectionLabel = 'Demo mode running locally';
const AccountabilityBoardContext = createContext<AccountabilityBoard | null>(null);

function readConfig(): AppwriteConfig | null {
  const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? '';
  const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? '';
  const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ?? '';
  const habitsCollectionId = process.env.EXPO_PUBLIC_APPWRITE_HABITS_COLLECTION_ID ?? '';
  const friendsCollectionId = process.env.EXPO_PUBLIC_APPWRITE_FRIENDS_COLLECTION_ID ?? '';
  const activityCollectionId = process.env.EXPO_PUBLIC_APPWRITE_ACTIVITY_COLLECTION_ID ?? '';

  if (!endpoint || !projectId || !databaseId || !habitsCollectionId || !friendsCollectionId || !activityCollectionId) {
    return null;
  }

  return {
    endpoint,
    projectId,
    databaseId,
    habitsCollectionId,
    friendsCollectionId,
    activityCollectionId,
  };
}

function createServices(): Services | null {
  const config = readConfig();

  if (!config) {
    return null;
  }

  const client = new Client().setEndpoint(config.endpoint).setProject(config.projectId);

  return {
    client,
    databases: new Databases(client),
    config,
  };
}

function normalizeArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function mapHabit(document: any): Habit {
  const completedToday = Boolean(document.completedToday);
  const streak = Number(document.streak ?? 0);
  const bestStreak = Number(document.bestStreak ?? streak);
  const progress = Number(document.progress ?? Math.min(100, Math.round((streak / Math.max(bestStreak, 1)) * 100)));

  return {
    id: document.$id,
    title: String(document.title ?? 'Untitled habit'),
    cadence: String(document.cadence ?? 'Daily'),
    streak,
    bestStreak,
    completedToday,
    supporters: normalizeArray(document.supporters),
    color: String(document.color ?? '#2563EB'),
    progress,
  };
}

function mapFriend(document: any): Friend {
  return {
    id: document.$id,
    name: String(document.name ?? 'Friend'),
    focus: String(document.focus ?? 'Accountability'),
    status: String(document.status ?? 'Watching the streak'),
    avatar: String(document.avatar ?? String(document.name ?? '?').slice(0, 1).toUpperCase()),
    live: Boolean(document.live),
  };
}

function mapActivity(document: any): Activity {
  return {
    id: document.$id,
    title: String(document.title ?? 'Accountability event'),
    detail: String(document.detail ?? 'Realtime update received.'),
    time: String(document.time ?? 'Just now'),
    tone: document.tone === 'warning' || document.tone === 'neutral' ? document.tone : 'positive',
  };
}

function normalizeTitle(title: string) {
  return title.trim();
}

export function AccountabilityBoardProvider({ children }: { children: ReactNode }) {
  const board = useAccountabilityBoardState();

  return createElement(AccountabilityBoardContext.Provider, { value: board }, children);
}

export function useAccountabilityBoard(): AccountabilityBoard {
  const context = useContext(AccountabilityBoardContext);

  if (!context) {
    throw new Error('useAccountabilityBoard must be used within AccountabilityBoardProvider');
  }

  return context;
}

function useAccountabilityBoardState(): AccountabilityBoard {
  const services = useState(() => createServices())[0];
  const [habits, setHabits] = useState(seedHabits);
  const [friends, setFriends] = useState(seedFriends);
  const [activity, setActivity] = useState(seedActivity);
  const [weekCheckInSeries, setWeekCheckInSeries] = useState<CheckInChartDay[]>([]);
  const [weekCheckInSeriesLoaded, setWeekCheckInSeriesLoaded] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>(services ? 'connecting' : 'demo');
  const [connectionLabel, setConnectionLabel] = useState(services ? 'Connecting to Appwrite realtime...' : defaultConnectionLabel);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const series = await persistTodayAndBuildWeekSeries(habits);
        if (!cancelled) {
          setWeekCheckInSeries(series);
          setWeekCheckInSeriesLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setWeekCheckInSeriesLoaded(true);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [habits]);

  const pushActivity = useCallback((entry: Omit<Activity, 'id'>) => {
    setActivity((current) =>
      [{ ...entry, id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}` }, ...current].slice(0, 40),
    );
  }, []);

  const refreshBoard = useCallback(async () => {
    if (!services) {
      return;
    }

    try {
      const [habitResponse, friendResponse, activityResponse] = await Promise.all([
        services.databases.listDocuments(services.config.databaseId, services.config.habitsCollectionId),
        services.databases.listDocuments(services.config.databaseId, services.config.friendsCollectionId),
        services.databases.listDocuments(services.config.databaseId, services.config.activityCollectionId),
      ]);

      setHabits(habitResponse.documents.length > 0 ? habitResponse.documents.map(mapHabit) : seedHabits);
      setFriends(friendResponse.documents.length > 0 ? friendResponse.documents.map(mapFriend) : seedFriends);
      setActivity(activityResponse.documents.length > 0 ? activityResponse.documents.map(mapActivity) : seedActivity);
      setConnectionState('live');
      setConnectionLabel('Appwrite database and realtime connected');
    } catch {
      setConnectionState('error');
      setConnectionLabel('Appwrite unavailable, using local demo data');
      setHabits(seedHabits);
      setFriends(seedFriends);
      setActivity(seedActivity);
    }
  }, [services]);

  useEffect(() => {
    if (!services) {
      return;
    }

    let cancelled = false;
    const subscriptions: Array<{ unsubscribe: () => Promise<void> }> = [];

    const watch = async () => {
      await refreshBoard();

      if (cancelled) {
        return;
      }

      const channels = [
        `databases.${services.config.databaseId}.collections.${services.config.habitsCollectionId}.documents`,
        `databases.${services.config.databaseId}.collections.${services.config.friendsCollectionId}.documents`,
        `databases.${services.config.databaseId}.collections.${services.config.activityCollectionId}.documents`,
      ];

      for (const channel of channels) {
        try {
          const subscription = await services.client.subscribe(channel, () => {
            void refreshBoard();
          });

          subscriptions.push(
            subscription as unknown as { unsubscribe: () => Promise<void> },
          );
        } catch {
          setConnectionState('error');
          setConnectionLabel('Realtime subscription failed, staying on local data');
        }
      }

      if (!cancelled) {
        setConnectionState('live');
      }
    };

    void watch();

    return () => {
      cancelled = true;
      subscriptions.forEach((subscription) => {
        void subscription.unsubscribe();
      });
    };
  }, [refreshBoard, services]);

  const toggleHabit = useCallback(
    async (habitId: string) => {
      let changed: Habit | undefined;

      setHabits((current) =>
        current.map((habit) => {
          if (habit.id !== habitId) {
            return habit;
          }

          const completedToday = !habit.completedToday;
          const streak = completedToday ? habit.streak + 1 : Math.max(habit.streak - 1, 0);

          const next: Habit = {
            ...habit,
            completedToday,
            streak,
            bestStreak: Math.max(habit.bestStreak, streak),
            progress: Math.min(100, Math.max(10, completedToday ? habit.progress + 5 : habit.progress - 8)),
          };

          changed = next;
          return next;
        }),
      );

      if (!changed) {
        return;
      }

      pushActivity({
        title: `${changed.title} ${changed.completedToday ? 'checked in' : 'reopened'}`,
        detail: `${changed.streak} day streak now syncing with the crew.`,
        time: 'Just now',
        tone: changed.completedToday ? 'positive' : 'warning',
      });

      if (!services) {
        return;
      }

      try {
        await services.databases.updateDocument(services.config.databaseId, services.config.habitsCollectionId, habitId, {
          completedToday: changed.completedToday,
          streak: changed.streak,
          bestStreak: changed.bestStreak,
          progress: changed.progress,
          supporters: changed.supporters,
          title: changed.title,
          cadence: changed.cadence,
          color: changed.color,
        });

        await services.databases.createDocument(services.config.databaseId, services.config.activityCollectionId, ID.unique(), {
          title: `${changed.title} ${changed.completedToday ? 'completed' : 'needs another push'}`,
          detail: `${changed.streak} day streak shared in realtime.`,
          time: 'Just now',
          tone: changed.completedToday ? 'positive' : 'warning',
        });
      } catch {
        setConnectionState('error');
        setConnectionLabel('Appwrite write failed, preserving local progress');
      }
    },
    [pushActivity, services],
  );

  const addActivity = useCallback(
    async (payload: { title: string; detail?: string }) => {
      const trimmedTitle = normalizeTitle(payload.title);

      if (!trimmedTitle) {
        return;
      }

      const detail =
        normalizeTitle(payload.detail ?? '') || 'Added from your journey.';

      const entry: Omit<Activity, 'id'> = {
        title: trimmedTitle,
        detail,
        time: 'Just now',
        tone: 'neutral',
      };

      pushActivity(entry);

      if (!services) {
        return;
      }

      try {
        await services.databases.createDocument(services.config.databaseId, services.config.activityCollectionId, ID.unique(), {
          title: entry.title,
          detail: entry.detail,
          time: entry.time,
          tone: entry.tone,
        });
      } catch {
        setConnectionState('error');
        setConnectionLabel('Activity saved locally; sync to Appwrite failed.');
      }
    },
    [pushActivity, services],
  );

  const addFriend = useCallback(
    async (name: string, focus: string) => {
      const trimmedName = normalizeTitle(name);

      if (!trimmedName) {
        return;
      }

      const nextFriend: Friend = {
        id: `${Date.now()}`,
        name: trimmedName,
        focus: normalizeTitle(focus) || 'Daily momentum',
        status: 'Invite queued for the next accountability round',
        avatar: trimmedName.slice(0, 1).toUpperCase(),
        live: true,
      };

      setFriends((current) => [nextFriend, ...current].slice(0, 6));
      pushActivity({
        title: `${nextFriend.name} joined the board`,
        detail: `${nextFriend.focus} is now part of the streak loop.`,
        time: 'Just now',
        tone: 'positive',
      });

      if (!services) {
        return;
      }

      try {
        await services.databases.createDocument(services.config.databaseId, services.config.friendsCollectionId, ID.unique(), {
          name: nextFriend.name,
          focus: nextFriend.focus,
          status: nextFriend.status,
          avatar: nextFriend.avatar,
          live: nextFriend.live,
        });
      } catch {
        setConnectionState('error');
        setConnectionLabel('Appwrite friend invite failed, keeping the local board');
      }
    },
    [pushActivity, services],
  );

  return {
    habits,
    friends,
    activity,
    connectionState,
    connectionLabel,
    servicesConfigured: Boolean(services),
    weekCheckInSeries,
    weekCheckInSeriesLoaded,
    toggleHabit,
    addFriend,
    addActivity,
    refreshBoard,
  };
}
