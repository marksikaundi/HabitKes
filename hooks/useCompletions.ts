import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatDate } from "@/utils/dateUtils";
import { useMutation, useQuery } from "convex/react";

export function useHabitCompletions(
  habitId: Id<"habits">,
  startDate?: string,
  endDate?: string
) {
  const completions = useQuery(api.completions.getHabitCompletions, {
    habitId,
    startDate,
    endDate,
  });
  return completions;
}

export function useTodayCompletions(userId?: string) {
  const today = formatDate(new Date());
  const completions = useQuery(api.completions.getTodayCompletions, {
    date: today,
    userId,
  });
  return completions;
}

export function useHabitStreak(habitId: Id<"habits">) {
  const streak = useQuery(api.completions.getHabitStreak, { habitId });
  return streak;
}

export function useCompleteHabit() {
  const completeHabit = useMutation(api.completions.completeHabit);
  const uncompleteHabit = useMutation(api.completions.uncompleteHabit);

  return {
    completeHabit: async ({
      habitId,
      date,
      value,
      userId,
    }: {
      habitId: Id<"habits">;
      date?: string;
      value?: number;
      userId?: string;
    }) => {
      const completionDate = date || formatDate(new Date());
      return await completeHabit({
        habitId,
        date: completionDate,
        value,
        userId,
      });
    },
    uncompleteHabit: async (habitId: Id<"habits">, date?: string) => {
      const completionDate = date || formatDate(new Date());
      return await uncompleteHabit({
        habitId,
        date: completionDate,
      });
    },
  };
}

export function useHabitStatus(habitId: Id<"habits">, date?: string) {
  const completionDate = date || formatDate(new Date());
  const completions = useQuery(api.completions.getHabitCompletions, {
    habitId,
    startDate: completionDate,
    endDate: completionDate,
  });

  const isCompleted = completions && completions.length > 0;
  return { isCompleted, completions };
}
