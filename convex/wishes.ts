import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* ---------- QUERIES ---------- */

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("wishes")
      .order("desc")
      .collect();
  },
});

export const lastEvent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", q =>
        q.eq("externalId", identity.subject)
      )
      .first();

    if (!user) return null;

    const last = await ctx.db
      .query("wishes")
      .order("desc")
      .first();

    if (!last) return null;

    if (last.createdBy === user._id) return null;

    return last;
  },
});

/* ---------- MUTATIONS ---------- */

export const add = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, { text }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", q =>
        q.eq("externalId", identity.subject)
      )
      .first();

    if (!user || user.role !== "author") {
      throw new Error("Only author can add wishes");
    }

    await ctx.db.insert("wishes", {
      text,
      createdBy: user._id,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const markDone = mutation({
  args: { id: v.id("wishes") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "marked_done" });
  },
});

export const confirm = mutation({
  args: { id: v.id("wishes") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "confirmed" });
  },
});