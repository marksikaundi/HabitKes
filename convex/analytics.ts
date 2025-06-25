import { query } from "./_generated/server";
import { v } from "convex/values";

// Get habit analytics for a specific habit
export const getHabitAnalytics = query({
  args: {
    habitId: v.id("habits"),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) return null;

    const completions = await ctx.db
      .query("habitCompletions")
      .filter((q) => q.eq(q.field("habitId"), args.habitId))
      .collect();

    let filteredCompletions = completions;

    // Filter by date range if provided
    if (args.startDate && args.endDate) {
      filteredCompletions = completions.filter(
        (c) => c.date >= args.startDate! && c.date <= args.endDate!
      );
    }

    const streak = await ctx.db
      .query("streaks")
      .filter((q) => q.eq(q.field("habitId"), args.habitId))
      .first();

    // Calculate success rate
    const totalDays = getDaysBetween(
      args.startDate || habit.startDate,
      args.endDate || new Date().toISOString().split('T')[0]
    );

    const completionRate = totalDays > 0 ? 
      (filteredCompletions.length / totalDays) * 100 : 0;

    return {
      habit,
      totalCompletions: filteredCompletions.length,
      completionRate: Math.round(completionRate * 100) / 100,
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
      completions: filteredCompletions.sort((a, b) => a.date.localeCompare(b.date)),
    };
  },
});

// Get overall user analytics
export const getUserAnalytics = query({
  args: {
    userId: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const habits = await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Filter by userId if provided
    const userHabits = args.userId
      ? habits.filter((habit) => habit.userId === args.userId)
      : habits.filter((habit) => !habit.userId);

    const allCompletions = await ctx.db
      .query("habitCompletions")
      .collect();

    // Filter completions by user and date range
    let userCompletions = args.userId
      ? allCompletions.filter((completion) => completion.userId === args.userId)
      : allCompletions.filter((completion) => !completion.userId);

    if (args.startDate && args.endDate) {
      userCompletions = userCompletions.filter(
        (c) => c.date >= args.startDate! && c.date <= args.endDate!
      );
    }

    // Get all streaks for user habits
    const allStreaks = await ctx.db.query("streaks").collect();
    const userStreaks = allStreaks.filter((streak) =>
      userHabits.some((habit) => habit._id === streak.habitId)
    );

    // Calculate perfect days (100% completion)
    const perfectDays = calculatePerfectDays(userHabits, userCompletions);

    // Find most consistent habit
    const mostConsistentHabit = findMostConsistentHabit(userHabits, userCompletions);

    return {
      totalHabits: userHabits.length,
      totalCompletions: userCompletions.length,
      perfectDays,
      averageStreakLength: userStreaks.length > 0 
        ? Math.round(userStreaks.reduce((sum, s) => sum + s.currentStreak, 0) / userStreaks.length)
        : 0,
      longestOverallStreak: Math.max(...userStreaks.map(s => s.longestStreak), 0),
      mostConsistentHabit,
      habitsAnalytics: await Promise.all(
        userHabits.map(async (habit) => {
          const habitCompletions = userCompletions.filter(c => c.habitId === habit._id);
          const streak = userStreaks.find(s => s.habitId === habit._id);
          
          return {
            habitId: habit._id,
            habitName: habit.name,
            completions: habitCompletions.length,
            currentStreak: streak?.currentStreak || 0,
            longestStreak: streak?.longestStreak || 0,
          };
        })
      ),
    };
  },
});

// Get weekly analytics
export const getWeeklyAnalytics = query({
  args: {
    userId: v.optional(v.string()),
    weekStart: v.string(), // YYYY-MM-DD format (Monday)
  },
  handler: async (ctx, args) => {
    const weekEnd = getWeekEnd(args.weekStart);
    
    const habits = await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const userHabits = args.userId
      ? habits.filter((habit) => habit.userId === args.userId)
      : habits.filter((habit) => !habit.userId);

    const weekCompletions = await ctx.db
      .query("habitCompletions")
      .filter((q) => 
        q.and(
          q.gte(q.field("date"), args.weekStart),
          q.lte(q.field("date"), weekEnd)
        )
      )
      .collect();

    const userWeekCompletions = args.userId
      ? weekCompletions.filter((c) => c.userId === args.userId)
      : weekCompletions.filter((c) => !c.userId);

    // Calculate daily completion rates
    const dailyStats = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(args.weekStart);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const dayCompletions = userWeekCompletions.filter(c => c.date === dateStr);
      const completionRate = userHabits.length > 0 
        ? (dayCompletions.length / userHabits.length) * 100 
        : 0;

      dailyStats.push({
        date: dateStr,
        completions: dayCompletions.length,
        totalHabits: userHabits.length,
        completionRate: Math.round(completionRate),
      });
    }

    const totalPossibleCompletions = userHabits.length * 7;
    const overallWeekRate = totalPossibleCompletions > 0
      ? (userWeekCompletions.length / totalPossibleCompletions) * 100
      : 0;

    return {
      weekStart: args.weekStart,
      weekEnd,
      totalCompletions: userWeekCompletions.length,
      totalPossibleCompletions,
      overallCompletionRate: Math.round(overallWeekRate),
      dailyStats,
      perfectDays: dailyStats.filter(day => day.completionRate === 100).length,
    };
  },
});

// Helper functions
function getDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function getWeekEnd(weekStart: string): string {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end.toISOString().split('T')[0];
}

function calculatePerfectDays(habits: any[], completions: any[]): number {
  if (habits.length === 0) return 0;

  const completionsByDate = completions.reduce((acc, completion) => {
    if (!acc[completion.date]) {
      acc[completion.date] = 0;
    }
    acc[completion.date]++;
    return acc;
  }, {} as Record<string, number>);

  return Object.values(completionsByDate).filter(
    (count) => count === habits.length
  ).length;
}

function findMostConsistentHabit(habits: any[], completions: any[]): any {
  if (habits.length === 0) return null;

  const habitStats = habits.map((habit) => {
    const habitCompletions = completions.filter(c => c.habitId === habit._id);
    const daysSinceStart = getDaysBetween(
      habit.startDate,
      new Date().toISOString().split('T')[0]
    );
    const consistency = daysSinceStart > 0 ? (habitCompletions.length / daysSinceStart) * 100 : 0;

    return {
      habit,
      consistency,
      completions: habitCompletions.length,
    };
  });

  return habitStats.reduce((most, current) => 
    current.consistency > most.consistency ? current : most
  );
}
