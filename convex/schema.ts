import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    role: v.union(
      v.literal("author"),
      v.literal("partner")
    ),
  }).index("by_externalId", ["externalId"]),

  wishes: defineTable({
    text: v.string(),
    createdBy: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("marked_done"),
      v.literal("confirmed")
    ),
    createdAt: v.number(),
  }),
});
