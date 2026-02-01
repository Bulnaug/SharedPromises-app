import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserByClerkId } from "./users";
import { getUserByClerkIdOrCreate } from "./users";

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
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await getUserByClerkId(ctx, identity.subject);

    const rooms = await ctx.db.query("rooms").collect();

    return rooms.filter(room =>
      room.ownerId === user._id ||
      room.memberIds.includes(user._id)
    );
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

export const inviteToRoom = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // ✅ ГАРАНТИРУЕМ, ЧТО USER СУЩЕСТВУЕТ
    const user = await getUserByClerkIdOrCreate(ctx, identity);

    const room = await ctx.db.get(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    // Уже участник — ничего не делаем
    if (
      room.ownerId === user!._id ||
      room.memberIds.includes(user!._id)
    ) {
      return;
    }

    // Ограничение: 2 человека
    if (room.memberIds.length >= 1) {
      throw new Error("Room already has two members");
    }

    await ctx.db.patch(roomId, {
      memberIds: [...room.memberIds, user!._id],
    });
  },
});
