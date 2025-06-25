import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getMonthEnd, getMonthStart, getWeekStart } from "@/utils/dateUtils";
import { useQuery } from "convex/react";

export function useHabitAnalytics(
  habitId: Id<"habits">,
  startDate?: string,
  endDate?: string
) {
  const analytics = useQuery(api.analytics.getHabitAnalytics, {
    habitId,
    startDate,
    endDate,
  });
  return analytics;
}

export function useUserAnalytics(
  userId?: string,
  startDate?: string,
  endDate?: string
) {
  const analytics = useQuery(api.analytics.getUserAnalytics, {
    userId,
    startDate,
    endDate,
  });
  return analytics;
}

export function useWeeklyAnalytics(userId?: string, weekStart?: string) {
  const weekStartDate = weekStart || getWeekStart();
  const analytics = useQuery(api.analytics.getWeeklyAnalytics, {
    userId,
    weekStart: weekStartDate,
  });
  return analytics;
}

export function useMonthlyAnalytics(userId?: string, date?: Date) {
  const currentDate = date || new Date();
  const startDate = getMonthStart(currentDate);
  const endDate = getMonthEnd(currentDate);

  const analytics = useQuery(api.analytics.getUserAnalytics, {
    userId,
    startDate,
    endDate,
  });

  return {
    ...analytics,
    monthStart: startDate,
    monthEnd: endDate,
  };
}
