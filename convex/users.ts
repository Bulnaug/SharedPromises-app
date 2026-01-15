import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return null;

    return await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), identity.email))
      .first();
  },
});

export const createUser = mutation({
  args: { role: v.union(v.literal("author"), v.literal("partner")) },
  handler: async (ctx, { role }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    await ctx.db.insert("users", {
      email: identity.email,
      role,
    });
  },
});
