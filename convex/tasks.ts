import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { findUserByClerkId, getUserByClerkIdOrCreate } from "./users";

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, { title, description, dueDate }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await getUserByClerkIdOrCreate(ctx, identity);

    return await ctx.db.insert("tasks", {
      title: title.trim(),
      description: description?.trim() || undefined,
      dueDate: dueDate || undefined,
      completed: false,
      createdAt: Date.now(),
      userId: user._id,
    });
  },
});

export const listMyTasks = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await findUserByClerkId(ctx, identity.subject);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const toggleTaskCompleted = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, { taskId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await getUserByClerkIdOrCreate(ctx, identity);

    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== user._id) {
      throw new Error("Not allowed");
    }

    await ctx.db.patch(taskId, {
      completed: !task.completed,
    });
  },
});