// convex/users.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Получить текущего пользователя
 */
export const getMe = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) =>
        q.eq("externalId", identity.subject)
      )
      .first();

    return user;
  },
});

/**
 * Создать пользователя, если его ещё нет
 * Вызывается сразу после логина
 */
export const getOrCreateMe = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) =>
        q.eq("externalId", identity.subject)
      )
      .first();

    if (existingUser) {
      return existingUser;
    }

    const userId = await ctx.db.insert("users", {
      externalId: identity.subject,
    });

    return await ctx.db.get(userId);
  },
});
