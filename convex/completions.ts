import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Mark habit as complete for a specific date
export const completeHabit = mutation({
  args: {
    habitId: v.id("habits"),
    date: v.string(), // YYYY-MM-DD format
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already completed for this date
    const existingCompletion = await ctx.db
      .query("habitCompletions")
      .filter((q) =>
        q.and(
          q.eq(q.field("habitId"), args.habitId),
          q.eq(q.field("date"), args.date)
        )
      )
      .first();

    if (existingCompletion) {
      return existingCompletion._id;
    }

    // Create completion record
    const completionId = await ctx.db.insert("habitCompletions", {
      habitId: args.habitId,
      date: args.date,
      completedAt: Date.now(),
      userId: args.userId,
    });

    // Update streak
    await updateStreak(ctx, args.habitId, args.date);

    return completionId;
  },
});

// Uncomplete habit for a specific date
export const uncompleteHabit = mutation({
  args: {
    habitId: v.id("habits"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const completion = await ctx.db
      .query("habitCompletions")
      .filter((q) =>
        q.and(
          q.eq(q.field("habitId"), args.habitId),
          q.eq(q.field("date"), args.date)
        )
      )
      .first();

    if (completion) {
      await ctx.db.delete(completion._id);
      // Recalculate streak
      await recalculateStreak(ctx, args.habitId);
      return completion._id;
    }

    return null;
  },
});

// Get completions for a habit in a date range
export const getHabitCompletions = query({
  args: {
    habitId: v.id("habits"),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let completions = await ctx.db
      .query("habitCompletions")
      .filter((q) => q.eq(q.field("habitId"), args.habitId))
      .collect();

    // Filter by date range if provided
    if (args.startDate && args.endDate) {
      completions = completions.filter(
        (c) => c.date >= args.startDate! && c.date <= args.endDate!
      );
    }

    return completions.sort((a, b) => b.date.localeCompare(a.date));
  },
});

// Get today's completions for all habits
export const getTodayCompletions = query({
  args: {
    date: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const completions = await ctx.db
      .query("habitCompletions")
      .filter((q) => q.eq(q.field("date"), args.date))
      .collect();

    // Filter by userId if provided
    if (args.userId) {
      return completions.filter(
        (completion) => completion.userId === args.userId
      );
    }

    return completions.filter((completion) => !completion.userId);
  },
});

// Get streak for a habit
export const getHabitStreak = query({
  args: {
    habitId: v.id("habits"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("streaks")
      .filter((q) => q.eq(q.field("habitId"), args.habitId))
      .first();
  },
});

// Helper function to update streak (internal)
async function updateStreak(ctx: any, habitId: string, completionDate: string) {
  const streak = await ctx.db
    .query("streaks")
    .filter((q: any) => q.eq(q.field("habitId"), habitId))
    .first();

  if (!streak) return;

  const today = new Date(completionDate);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastCompletionDate = streak.lastCompletionDate
    ? new Date(streak.lastCompletionDate)
    : null;

  let newCurrentStreak = 1;

  // If there was a completion yesterday, increment streak
  if (
    lastCompletionDate &&
    lastCompletionDate.toISOString().split("T")[0] ===
      yesterday.toISOString().split("T")[0]
  ) {
    newCurrentStreak = streak.currentStreak + 1;
  }

  const newLongestStreak = Math.max(streak.longestStreak, newCurrentStreak);

  await ctx.db.patch(streak._id, {
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    lastCompletionDate: completionDate,
  });
}

// Helper function to recalculate streak after uncompleting
async function recalculateStreak(ctx: any, habitId: string) {
  const completions = await ctx.db
    .query("habitCompletions")
    .filter((q: any) => q.eq(q.field("habitId"), habitId))
    .collect();

  const sortedCompletions = completions.sort((a: any, b: any) =>
    b.date.localeCompare(a.date)
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (const completion of sortedCompletions.reverse()) {
    const completionDate = new Date(completion.date);

    if (lastDate === null) {
      tempStreak = 1;
    } else {
      const dayDiff = Math.floor(
        (completionDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    lastDate = completionDate;
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate current streak (from today backwards)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  currentStreak = 0;
  for (let i = 0; i < sortedCompletions.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const checkDateStr = checkDate.toISOString().split("T")[0];

    const hasCompletion = sortedCompletions.some(
      (c: any) => c.date === checkDateStr
    );
    if (hasCompletion) {
      currentStreak++;
    } else {
      break;
    }
  }

  const streak = await ctx.db
    .query("streaks")
    .filter((q: any) => q.eq(q.field("habitId"), habitId))
    .first();

  if (streak) {
    await ctx.db.patch(streak._id, {
      currentStreak,
      longestStreak,
      lastCompletionDate: sortedCompletions[0]?.date || undefined,
    });
  }
}
