import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserByClerkId } from "./users";

export const createRoom = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await getUserByClerkId(ctx, identity.subject);

    return await ctx.db.insert("rooms", {
      name,
      ownerId: user._id,
      memberIds: [],
      createdAt: Date.now(),
    });
  },
});

export const getMyRooms = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await getUserByClerkId(ctx, identity.subject);

    const ownedRooms = await ctx.db
      .query("rooms")
      .withIndex("by_ownerId", (q) =>
        q.eq("ownerId", user._id)
      )
      .collect();

    const memberRooms = await ctx.db
      .query("rooms")
      .withIndex("by_memberId", (q) =>
        q.eq("memberIds", user._id as any)
      )
      .collect();

    return [...ownedRooms, ...memberRooms];
  },
});

export const getRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const room = await ctx.db.get(roomId);
    if (!room) return null;

    const users = await Promise.all([
      ctx.db.get(room.ownerId),
      ...room.memberIds.map((id) => ctx.db.get(id)),
    ]);

    return {
      ...room,
      users: users.filter(Boolean),
    };
  },
});
