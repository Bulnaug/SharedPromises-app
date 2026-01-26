import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),

  rooms: defineTable({
  name: v.string(),
  ownerId: v.id("users"),
  memberIds: v.array(v.id("users")),
  createdAt: v.number(),
})
  .index("by_ownerId", ["ownerId"])
  .index("by_memberId", ["memberIds"]),

  wishes: defineTable({
    roomId: v.id("rooms"),
    authorId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    fulfilled: v.boolean(),
    createdAt: v.number(),
  }).index("by_roomId", ["roomId"]),
});