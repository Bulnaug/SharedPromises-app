import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("wishes").collect();
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user?.email) throw new Error("Not authenticated");

    const dbUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), user.email))
      .first();

    if (dbUser?.role !== "author") {
      throw new Error("Forbidden");
    }

    await ctx.db.insert("wishes", {
      text,
      createdBy: dbUser._id,
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
