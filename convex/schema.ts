import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
  }).index("by_externalId", ["externalId"]),

  rooms: defineTable({
    name: v.string(),
    createdAt: v.number(),
  }),

  roomMembers: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    role: v.union(v.literal("author"), v.literal("partner")),
    joinedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_room", ["roomId"])
    .index("by_room_user", ["roomId", "userId"]),

  wishes: defineTable({
  text: v.string(),
  createdBy: v.id("users"),
  roomId: v.id("rooms"),
  status: v.union(
    v.literal("pending"),
    v.literal("marked_done"),
    v.literal("confirmed")
  ),
  createdAt: v.number(),
}).index("by_room", ["roomId"]),
});
