import { Id } from "@/convex/_generated/dataModel";

export type HabitFrequency =
  | "daily"
  | "weekly"
  | { type: "custom"; days: number[] };

export type HabitType = "boolean" | "numeric" | "steps";

export interface Habit {
  _id: Id<"habits">;
  name: string;
  description?: string;
  color: string;
  emoji?: string;
  frequency: HabitFrequency;
  type?: HabitType; // Optional for backward compatibility
  targetValue?: number; // For numeric and steps habits
  unit?: string; // e.g., "steps", "minutes", "glasses"
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  userId?: string;
}

export interface HabitCompletion {
  _id: Id<"habitCompletions">;
  habitId: Id<"habits">;
  date: string;
  completedAt: number;
  value?: number; // For numeric habits (steps, minutes, etc.)
  isCompleted?: boolean; // True if target is met for numeric habits - optional for backward compatibility
  userId?: string;
}

export interface HabitStreak {
  _id: Id<"streaks">;
  habitId: Id<"habits">;
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate?: string;
  userId?: string;
}

export interface HabitWithCompletion extends Habit {
  isCompletedToday: boolean;
  streak: HabitStreak | null;
}

export interface HabitAnalytics {
  habit: Habit;
  totalCompletions: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  completions: HabitCompletion[];
}

export interface UserAnalytics {
  totalHabits: number;
  totalCompletions: number;
  perfectDays: number;
  averageStreakLength: number;
  longestOverallStreak: number;
  mostConsistentHabit: any;
  habitsAnalytics: {
    habitId: Id<"habits">;
    habitName: string;
    completions: number;
    currentStreak: number;
    longestStreak: number;
  }[];
}

export interface WeeklyAnalytics {
  weekStart: string;
  weekEnd: string;
  totalCompletions: number;
  totalPossibleCompletions: number;
  overallCompletionRate: number;
  dailyStats: {
    date: string;
    completions: number;
    totalHabits: number;
    completionRate: number;
  }[];
  perfectDays: number;
}

export const HABIT_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FECA57", // Yellow
  "#FF9FF3", // Pink
  "#54A0FF", // Light Blue
  "#5F27CD", // Purple
  "#00D2D3", // Cyan
  "#FF9F43", // Orange
  "#2ED573", // Lime
  "#FF6348", // Coral
];

export const HABIT_EMOJIS = [
  "💪",
  "📚",
  "💧",
  "🏃",
  "🧘",
  "🍎",
  "💤",
  "🚫",
  "🎯",
  "📝",
  "🌱",
  "☀️",
  "🎵",
  "🧽",
  "💼",
  "📞",
  "🎨",
  "🍽️",
  "🚶",
  "📖",
  "👟", // Steps
  "🚴", // Cycling
  "🏋️", // Weight lifting
  "🏊", // Swimming
  "⏱️", // Timer
  "📊", // Stats
  "🎯", // Target
  "📈", // Progress
];

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
