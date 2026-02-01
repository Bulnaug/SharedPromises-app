import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserByClerkId } from "./users";

export const getWishesByRoomGrouped = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, { roomId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const me = await getUserByClerkId(ctx, identity.subject);

    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");

    const wishes = await ctx.db
      .query("wishes")
      .withIndex("by_room", q =>
        q.eq("roomId", roomId)
      )
      .collect();

    // группируем по userId
    const grouped: Record<string, typeof wishes> = {};

    for (const wish of wishes) {
  if (!wish.userId) continue;

  const key = wish.userId.toString();

  if (!grouped[key]) {
    grouped[key] = [];
  }

  grouped[key].push(wish);
}

    return {
      room,
      members: room.memberIds,
      wishesByUser: grouped,
      meId: me._id,
    };
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
      userId: user._id,
      title,
      completedDates: [],
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

export const getWishesByRoom = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, { roomId }) => {
    return await ctx.db
      .query("wishes")
      .withIndex("by_room", (q) =>
        q.eq("roomId", roomId)
      )
      .collect();
  },
});

