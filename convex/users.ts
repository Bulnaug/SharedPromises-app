import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    // ДЛЯ ОТЛАДКИ - выводим всю информацию
    console.log("=== GETME CALLED ===");
    
    const identity = await ctx.auth.getUserIdentity();
    console.log("Identity from ctx.auth:", identity);
    
    if (!identity) {
      console.log("No identity - returning null");
      return null;
    }
    
    console.log("Looking for user with externalId:", identity.subject);
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", q => 
        q.eq("externalId", identity.subject)
      )
      .first();
    
    console.log("Found user:", user);
    return user;
  },
});

export const createMe = mutation({
  args: {
    role: v.union(
      v.literal("author"),
      v.literal("partner")
    ),
  },
  handler: async (ctx, { role }) => {
    console.log("=== CREATEME CALLED ===");
    
    const identity = await ctx.auth.getUserIdentity();
    console.log("Identity in createMe:", identity);
    
    if (!identity) {
      console.error("THROWING: Not authenticated");
      throw new Error("Not authenticated");
    }
    
    // Проверяем, существует ли уже пользователь
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_externalId", q => 
        q.eq("externalId", identity.subject)
      )
      .first();
    
    if (existingUser) {
      console.log("User already exists, returning existing ID:", existingUser._id);
      return existingUser._id;
    }
    
    // Создаем нового пользователя
    console.log("Creating new user with externalId:", identity.subject);
    const userId = await ctx.db.insert("users", {
      externalId: identity.subject,
      role,
      createdAt: Date.now(),
    });
    
    console.log("Created user with ID:", userId);
    return userId;
  },
});