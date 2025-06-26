import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new habit
export const createHabit = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
    emoji: v.optional(v.string()),
    frequency: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.object({
        type: v.literal("custom"),
        days: v.array(v.number()),
      })
    ),
    type: v.optional(v.union(
      v.literal("boolean"),
      v.literal("numeric"),
      v.literal("steps")
    )),
    targetValue: v.optional(v.number()),
    unit: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const habitId = await ctx.db.insert("habits", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // Initialize streak record
    await ctx.db.insert("streaks", {
      habitId,
      currentStreak: 0,
      longestStreak: 0,
      userId: args.userId,
    });

    return habitId;
  },
});

// Get all active habits
export const getActiveHabits = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const habits = await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Filter by userId if provided
    if (args.userId) {
      return habits.filter((habit) => habit.userId === args.userId);
    }

    return habits.filter((habit) => !habit.userId);
  },
});

// Update habit
export const updateHabit = mutation({
  args: {
    id: v.id("habits"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    emoji: v.optional(v.string()),
    frequency: v.optional(
      v.union(
        v.literal("daily"),
        v.literal("weekly"),
        v.object({
          type: v.literal("custom"),
          days: v.array(v.number()),
        })
      )
    ),
    type: v.optional(
      v.union(v.literal("boolean"), v.literal("numeric"), v.literal("steps"))
    ),
    targetValue: v.optional(v.number()),
    unit: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    return id;
  },
});

// Archive/deactivate habit
export const archiveHabit = mutation({
  args: {
    id: v.id("habits"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isActive: false,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

// Delete habit (and all related data)
export const deleteHabit = mutation({
  args: {
    id: v.id("habits"),
  },
  handler: async (ctx, args) => {
    // Delete all completions for this habit
    const completions = await ctx.db
      .query("habitCompletions")
      .filter((q) => q.eq(q.field("habitId"), args.id))
      .collect();

    for (const completion of completions) {
      await ctx.db.delete(completion._id);
    }

    // Delete streak record
    const streak = await ctx.db
      .query("streaks")
      .filter((q) => q.eq(q.field("habitId"), args.id))
      .first();

    if (streak) {
      await ctx.db.delete(streak._id);
    }

    // Delete the habit
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get habit by ID
export const getHabit = query({
  args: {
    id: v.id("habits"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
