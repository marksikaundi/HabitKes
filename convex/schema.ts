import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  habits: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
    emoji: v.optional(v.string()),
    frequency: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.object({
        type: v.literal("custom"),
        days: v.array(v.number()), // 0=Sunday, 1=Monday, etc.
      })
    ),
    startDate: v.string(), // ISO date string
    endDate: v.optional(v.string()), // ISO date string
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.optional(v.string()), // For future user authentication
  })
    .index("by_user", ["userId"])
    .index("by_active", ["isActive"])
    .index("by_created", ["createdAt"]),

  habitCompletions: defineTable({
    habitId: v.id("habits"),
    date: v.string(), // ISO date string (YYYY-MM-DD)
    completedAt: v.number(), // timestamp
    userId: v.optional(v.string()),
  })
    .index("by_habit", ["habitId"])
    .index("by_date", ["date"])
    .index("by_habit_date", ["habitId", "date"])
    .index("by_user", ["userId"]),

  streaks: defineTable({
    habitId: v.id("habits"),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastCompletionDate: v.optional(v.string()), // ISO date string
    userId: v.optional(v.string()),
  })
    .index("by_habit", ["habitId"])
    .index("by_user", ["userId"]),
});
