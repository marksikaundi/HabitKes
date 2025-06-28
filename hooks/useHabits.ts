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
      console.log(`[useCreateHabit] Starting create for habit: ${habitData.name}`);
      try {
        const startDate = habitData.startDate || formatDate(new Date());
        const type = habitData.type || "boolean";
        const result = await createHabit({
          ...habitData,
          type,
          startDate,
        });
        console.log(`[useCreateHabit] Create successful:`, result);
        return result;
      } catch (error) {
        console.error(`[useCreateHabit] Create failed:`, error);
        throw error;
      }
    },
  };
}

export function useUpdateHabit() {
  const updateHabit = useMutation(api.habits.updateHabit);
  
  return {
    updateHabit: async (args: {
      id: Id<"habits">;
      name?: string;
      description?: string;
      color?: string;
      emoji?: string;
      frequency?: HabitFrequency;
      type?: HabitType;
      targetValue?: number;
      unit?: string;
      endDate?: string;
    }) => {
      console.log(`[useUpdateHabit] Starting update for habit ID: ${args.id}`);
      try {
        const result = await updateHabit(args);
        console.log(`[useUpdateHabit] Update successful:`, result);
        return result;
      } catch (error) {
        console.error(`[useUpdateHabit] Update failed:`, error);
        throw error;
      }
    },
  };
}

export function useArchiveHabit() {
  const archiveHabit = useMutation(api.habits.archiveHabit);
  return { archiveHabit };
}

export function useDeleteHabit() {
  const deleteHabit = useMutation(api.habits.deleteHabit);
  
  return {
    deleteHabit: async (args: { id: Id<"habits"> }) => {
      console.log(`[useDeleteHabit] Starting delete for habit ID: ${args.id}`);
      try {
        const result = await deleteHabit(args);
        console.log(`[useDeleteHabit] Delete successful:`, result);
        return result;
      } catch (error) {
        console.error(`[useDeleteHabit] Delete failed:`, error);
        throw error;
      }
    },
  };
}
