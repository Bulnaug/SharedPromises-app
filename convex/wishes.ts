import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Получить все желания комнаты
 */
export const listByRoom = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, { roomId }) => {
    return await ctx.db
      .query("wishes")
      .withIndex("by_room", q => q.eq("roomId", roomId))
      .order("asc")
      .collect();
  },
});

/**
 * Добавить желание
 */
export const add = mutation({
  args: {
    roomId: v.id("rooms"),
    text: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, { roomId, text, userId }) => {
    return await ctx.db.insert("wishes", {
      text,
      roomId,
      createdBy: userId,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

/**
 * Отметить как выполненное
 */
export const markDone = mutation({
  args: {
    wishId: v.id("wishes"),
  },
  handler: async (ctx, { wishId }) => {
    await ctx.db.patch(wishId, {
      status: "marked_done",
    });
  },
});

/**
 * Подтвердить выполнение
 */
export const confirm = mutation({
  args: {
    wishId: v.id("wishes"),
  },
  handler: async (ctx, { wishId }) => {
    await ctx.db.patch(wishId, {
      status: "confirmed",
    });
  },
});

/**
 * Удалить желание
 */
export const remove = mutation({
  args: {
    wishId: v.id("wishes"),
  },
  handler: async (ctx, { wishId }) => {
    await ctx.db.delete(wishId);
  },
});
