import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserByClerkId } from "./users";

export const getWishesByRoom = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, { roomId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await getUserByClerkId(ctx, identity.subject);

    const room = await ctx.db.get(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const isMember =
      room.ownerId === user._id ||
      room.memberIds.includes(user._id);

    if (!isMember) {
      throw new Error("Access denied");
    }

    return await ctx.db
      .query("wishes")
      .withIndex("by_roomId", (q) =>
        q.eq("roomId", roomId)
      )
      .order("desc")
      .collect();
  },
});

export const createWish = mutation({
  args: {
    roomId: v.id("rooms"),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { roomId, title, description }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await getUserByClerkId(ctx, identity.subject);

    const room = await ctx.db.get(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const isMember =
      room.ownerId === user._id ||
      room.memberIds.includes(user._id);

    if (!isMember) {
      throw new Error("Access denied");
    }

    return await ctx.db.insert("wishes", {
      roomId,
      authorId: user._id,
      title,
      description,
      fulfilled: false,
      createdAt: Date.now(),
    });
  },
});

export const toggleWishFulfilled = mutation({
  args: {
    wishId: v.id("wishes"),
  },
  handler: async (ctx, { wishId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await getUserByClerkId(ctx, identity.subject);

    const wish = await ctx.db.get(wishId);
    if (!wish) {
      throw new Error("Wish not found");
    }

    const room = await ctx.db.get(wish.roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const isMember =
      room.ownerId === user._id ||
      room.memberIds.includes(user._id);

    if (!isMember) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(wishId, {
      fulfilled: !wish.fulfilled,
    });
  },
});