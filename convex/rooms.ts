import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserByClerkId } from "./users";
import { getUserByClerkIdOrCreate } from "./users";

const generateInviteCode = () =>
  Math.random().toString(36).substring(2, 10);

// ========================
// CREATE ROOM
// ========================

export const createRoom = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await getUserByClerkId(ctx, identity.subject);

    return await ctx.db.insert("rooms", {
      name,
      ownerId: user._id,
      memberIds: [],
      inviteCode: generateInviteCode(),
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

// ========================
// GET ROOM BY ID
// ========================

export const getById = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    return await ctx.db.get(roomId);
  },
});

// ========================
// GET MEMBERS
// ========================

export const getMembers = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const room = await ctx.db.get(roomId);
    if (!room) return [];

    const members = await Promise.all([
      ctx.db.get(room.ownerId),
      ...room.memberIds.map((id) => ctx.db.get(id)),
    ]);

    return members.filter(
      (member): member is NonNullable<typeof member> =>
        member !== null
    );
  },
});

// ========================
// REGENERATE INVITE
// ========================

export const regenerateInvite = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await getUserByClerkId(ctx, identity.subject);
    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");

    if (room.ownerId !== user._id) {
      throw new Error("Only owner can regenerate invite");
    }

    await ctx.db.patch(roomId, {
      inviteCode: generateInviteCode(),
    });
  },
});

// ========================
// REMOVE MEMBER
// ========================

export const removeMember = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
  },
  handler: async (ctx, { roomId, userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUser = await getUserByClerkId(
      ctx,
      identity.subject
    );

    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");

    if (room.ownerId !== currentUser._id) {
      throw new Error("Only owner can remove members");
    }

    await ctx.db.patch(roomId, {
      memberIds: room.memberIds.filter(
        (id) => id !== userId
      ),
    });
  },
});

// ========================
// LEAVE ROOM
// ========================

export const leave = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await getUserByClerkId(ctx, identity.subject);
    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");

    if (room.ownerId === user._id) {
      throw new Error("Owner cannot leave room");
    }

    await ctx.db.patch(roomId, {
      memberIds: room.memberIds.filter(
        (id) => id !== user._id
      ),
    });
  },
});

// ========================
// DELETE ROOM
// ========================

export const deleteRoom = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await getUserByClerkId(ctx, identity.subject);
    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");

    if (room.ownerId !== user._id) {
      throw new Error("Only owner can delete room");
    }

    await ctx.db.delete(roomId);
  },
});