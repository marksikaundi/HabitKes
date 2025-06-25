import { HabitFrequency } from "@/types/habit";

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

export function isToday(dateString: string): boolean {
  const today = new Date();
  const date = parseDate(dateString);
  return formatDate(today) === formatDate(date);
}

export function isYesterday(dateString: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const date = parseDate(dateString);
  return formatDate(yesterday) === formatDate(date);
}

export function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
}

export function getDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  return formatDate(d);
}

export function getWeekEnd(weekStart: string): string {
  const start = parseDate(weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return formatDate(end);
}

export function getMonthStart(date: Date = new Date()): string {
  const d = new Date(date);
  d.setDate(1);
  return formatDate(d);
}

export function getMonthEnd(date: Date = new Date()): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  return formatDate(d);
}

export function shouldHabitBeCompletedToday(frequency: HabitFrequency): boolean {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  switch (frequency) {
    case "daily":
      return true;
    case "weekly":
      return today === 1; // Monday only
    default:
      if (frequency.type === "custom") {
        return frequency.days.includes(today);
      }
      return false;
  }
}

export function getHabitFrequencyText(frequency: HabitFrequency): string {
  switch (frequency) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    default:
      if (frequency.type === "custom") {
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const selectedDays = frequency.days.map(day => dayNames[day]).join(", ");
        return `Custom (${selectedDays})`;
      }
      return "Unknown";
  }
}

export function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  const current = new Date(start);
  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

export function getStreakEmoji(streak: number): string {
  if (streak === 0) return "⭕";
  if (streak < 3) return "🔥";
  if (streak < 7) return "🔥🔥";
  if (streak < 30) return "🔥🔥🔥";
  return "🏆";
}

export function getWeekDates(weekStart: string): string[] {
  const dates: string[] = [];
  const start = parseDate(weekStart);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(formatDate(date));
  }
  
  return dates;
}

export function getRelativeDateText(dateString: string): string {
  const date = parseDate(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  
  if (formatDate(date) === formatDate(today)) {
    return "Today";
  } else if (formatDate(date) === formatDate(yesterday)) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
}

export function validateHabitName(name: string): string | null {
  if (!name.trim()) {
    return "Habit name is required";
  }
  if (name.trim().length < 2) {
    return "Habit name must be at least 2 characters";
  }
  if (name.trim().length > 50) {
    return "Habit name must be less than 50 characters";
  }
  return null;
}

export function validateDateRange(startDate: string, endDate?: string): string | null {
  const start = parseDate(startDate);
  const today = new Date();
  
  if (start > today) {
    return "Start date cannot be in the future";
  }
  
  if (endDate) {
    const end = parseDate(endDate);
    if (end < start) {
      return "End date must be after start date";
    }
  }
  
  return null;
}
