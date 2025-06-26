import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { HabitFrequency, HabitType } from "@/types/habit";
import { formatDate } from "@/utils/dateUtils";
import { useMutation, useQuery } from "convex/react";

export function useHabits(userId?: string) {
  const habits = useQuery(api.habits.getActiveHabits, { userId });
  return habits;
}

export function useHabit(habitId: Id<"habits">) {
  const habit = useQuery(api.habits.getHabit, { id: habitId });
  return habit;
}

export function useCreateHabit() {
  const createHabit = useMutation(api.habits.createHabit);

  return {
    createHabit: async (habitData: {
      name: string;
      description?: string;
      color: string;
      emoji?: string;
      frequency: HabitFrequency;
      type?: HabitType;
      targetValue?: number;
      unit?: string;
      startDate?: string;
      endDate?: string;
      userId?: string;
    }) => {
      const startDate = habitData.startDate || formatDate(new Date());
      const type = habitData.type || "boolean";
      return await createHabit({
        ...habitData,
        type,
        startDate,
      });
    },
  };
}

export function useUpdateHabit() {
  const updateHabit = useMutation(api.habits.updateHabit);
  return { updateHabit };
}

export function useArchiveHabit() {
  const archiveHabit = useMutation(api.habits.archiveHabit);
  return { archiveHabit };
}

export function useDeleteHabit() {
  const deleteHabit = useMutation(api.habits.deleteHabit);
  return { deleteHabit };
}
