import { HABIT_COLORS, HABIT_EMOJIS, HabitFrequency } from "@/types/habit";

// Sample habit data for testing
export const sampleHabits = [
  {
    name: "Drink Water",
    description: "Drink 8 glasses of water daily",
    color: HABIT_COLORS[0], // Red
    emoji: HABIT_EMOJIS[2], // 💧
    frequency: "daily" as HabitFrequency,
  },
  {
    name: "Morning Exercise",
    description: "30 minutes of exercise every morning",
    color: HABIT_COLORS[1], // Teal
    emoji: HABIT_EMOJIS[3], // 🏃
    frequency: "daily" as HabitFrequency,
  },
  {
    name: "Read Books",
    description: "Read for at least 30 minutes",
    color: HABIT_COLORS[2], // Blue
    emoji: HABIT_EMOJIS[1], // 📚
    frequency: "daily" as HabitFrequency,
  },
  {
    name: "Meditation",
    description: "10 minutes of mindfulness meditation",
    color: HABIT_COLORS[3], // Green
    emoji: HABIT_EMOJIS[4], // 🧘
    frequency: "daily" as HabitFrequency,
  },
  {
    name: "Weekly Review",
    description: "Review and plan for the upcoming week",
    color: HABIT_COLORS[4], // Yellow
    emoji: HABIT_EMOJIS[9], // 📝
    frequency: "weekly" as HabitFrequency,
  },
];

// Generate sample completion data for testing
export function generateSampleCompletions(
  habitIds: string[],
  daysBack: number = 30
) {
  const completions: {
    habitId: string;
    date: string;
    completedAt: number;
  }[] = [];
  const today = new Date();

  for (let i = 0; i < daysBack; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];

    // Randomly complete habits (80% chance for each habit)
    habitIds.forEach((habitId) => {
      if (Math.random() > 0.2) {
        // 80% completion rate
        completions.push({
          habitId,
          date: dateString,
          completedAt: date.getTime(),
        });
      }
    });
  }

  return completions;
}

// Motivational messages
export const motivationalMessages = {
  morning: [
    "🌅 Good morning! Ready to build some great habits today?",
    "☀️ A new day, a new opportunity to grow!",
    "🎯 Let's make today count!",
    "💪 You've got this! Start strong!",
  ],
  completion: [
    "🎉 Awesome! You completed a habit!",
    "✨ Great job! Every habit counts!",
    "🔥 You're on fire! Keep it up!",
    "💪 Strong work! Building habits one day at a time!",
  ],
  streak: [
    "🔥 You're on a streak! Don't break the chain!",
    "⚡ Consistency is key! Keep going!",
    "🏆 Habit champion in the making!",
    "🎯 You're building momentum!",
  ],
  encouragement: [
    "🌱 Every small step counts!",
    "💎 Progress over perfection!",
    "🚀 You're building a better you!",
    "⭐ Believe in your potential!",
  ],
};

export function getRandomMessage(
  category: keyof typeof motivationalMessages
): string {
  const messages = motivationalMessages[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Achievement definitions
export const achievements = [
  {
    id: "first_habit",
    title: "Getting Started",
    description: "Create your first habit",
    icon: "🌱",
    condition: (stats: any) => stats.totalHabits >= 1,
  },
  {
    id: "week_streak",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    condition: (stats: any) => stats.longestOverallStreak >= 7,
  },
  {
    id: "month_streak",
    title: "Month Master",
    description: "Maintain a 30-day streak",
    icon: "🏆",
    condition: (stats: any) => stats.longestOverallStreak >= 30,
  },
  {
    id: "perfect_week",
    title: "Perfect Week",
    description: "Complete all habits for 7 days straight",
    icon: "⭐",
    condition: (stats: any) => stats.perfectDays >= 7,
  },
  {
    id: "habit_collector",
    title: "Habit Collector",
    description: "Create 5 different habits",
    icon: "📚",
    condition: (stats: any) => stats.totalHabits >= 5,
  },
  {
    id: "century_club",
    title: "Century Club",
    description: "Complete 100 habit check-ins",
    icon: "💯",
    condition: (stats: any) => stats.totalCompletions >= 100,
  },
];

export function checkAchievements(userStats: any): any[] {
  return achievements.filter((achievement) => achievement.condition(userStats));
}

// Default app settings
export const defaultSettings = {
  notifications: {
    enabled: true,
    dailyReminder: true,
    reminderTime: { hour: 9, minute: 0 },
    achievements: true,
    streakCelebration: true,
  },
  display: {
    theme: "auto", // 'light', 'dark', 'auto'
    firstDayOfWeek: 1, // 0 = Sunday, 1 = Monday
    dateFormat: "MM/DD/YYYY",
  },
  backup: {
    autoBackup: false,
    lastBackup: null,
  },
};
