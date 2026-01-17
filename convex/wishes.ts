import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./lib/getUser";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("wishes")
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    const user = await getCurrentUser(ctx);

    if (user.role !== "author") {
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
    const user = await getCurrentUser(ctx);
    const wish = await ctx.db.get(id);

    if (!wish) throw new Error("Wish not found");

    if (user.role !== "author") {
      throw new Error("Only author can mark done");
    }

    if (wish.createdBy !== user._id) {
      throw new Error("Not your wish");
    }

    await ctx.db.patch(id, {
      status: "marked_done",
    });
  },
});

export const confirm = mutation({
  args: { id: v.id("wishes") },
  handler: async (ctx, { id }) => {
    const user = await getCurrentUser(ctx);
    const wish = await ctx.db.get(id);

    if (!wish) throw new Error("Wish not found");

    if (user.role !== "partner") {
      throw new Error("Only partner can confirm");
    }

    if (wish.status !== "marked_done") {
      throw new Error("Wish is not ready for confirmation");
    }

    await ctx.db.patch(id, {
      status: "confirmed",
    });
  },
});