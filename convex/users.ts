import { query, mutation } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

export const getUserByClerkId = async (
  ctx: QueryCtx,
  clerkId: string
) => {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) =>
      q.eq("clerkId", clerkId)
    )
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const createMe = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (existing) {
      return existing;
    }

    const user = await ctx.db.insert("users", {
      clerkId: identity.subject,
      name: identity.name ?? "User",
      email: identity.email ?? undefined,
    });

    return user;
  },
});

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();
  },
});

export const updateMyName = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      name,
    });

    return { success: true };
  },
});

export async function getUserByClerkIdOrCreate(
  ctx: MutationCtx,
  identity: {
    subject: string;
    name?: string | null;
    email?: string | null;
  }
) {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) =>
      q.eq("clerkId", identity.subject)
    )
    .unique();

  if (existing) {
    return existing;
  }

  const userId = await ctx.db.insert("users", {
    clerkId: identity.subject,
    name: identity.name ?? "User",
    email: identity.email ?? undefined,
  });

  const created = await ctx.db.get(userId);

  if (!created) {
    throw new Error("Failed to create user");
  }

  return created; // ✅ теперь гарантированно не null
}

export const findUserByClerkId = async (
  ctx: QueryCtx,
  clerkId: string
) => {
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .unique();
};