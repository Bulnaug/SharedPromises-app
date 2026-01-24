// convex/rooms.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Создать комнату + назначить роль создателю
 */
export const createRoom = mutation({
  args: {
    name: v.string(),
    role: v.union(v.literal("author"), v.literal("partner")),
  },
  handler: async (ctx, { name, role }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const me = await ctx.db
      .query("users")
      .withIndex("by_externalId", q =>
        q.eq("externalId", identity.subject)
      )
      .first();

    if (!me) throw new Error("User not found");

    const roomId = await ctx.db.insert("rooms", {
      name,
      createdAt: Date.now(),
    });

    await ctx.db.insert("roomMembers", {
      roomId,
      userId: me._id,
      role,
      joinedAt: Date.now(),
    });

    return roomId;
  },
});

/**
 * Получить комнаты текущего пользователя
 */
export const listMyRooms = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const me = await ctx.db
      .query("users")
      .withIndex("by_externalId", q =>
        q.eq("externalId", identity.subject)
      )
      .first();

    if (!me) return [];

    const memberships = await ctx.db
      .query("roomMembers")
      .withIndex("by_user", q =>
        q.eq("userId", me._id)
      )
      .collect();

    const rooms = await Promise.all(
      memberships.map(m => ctx.db.get(m.roomId))
    );

    return rooms.filter(Boolean);
  },
});
