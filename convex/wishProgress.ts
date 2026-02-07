import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByDateRange = query({
  args: { from: v.string(), to: v.string() },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("wishProgress")
      .filter(q =>
        q.and(
          q.gte(q.field("date"), args.from),
          q.lte(q.field("date"), args.to)
        )
      )
      .collect();

    // подгружаем желания
    const wishesById: Record<string, any> = {};
    for (const p of progress) {
      if (!wishesById[p.wishId]) {
        const wish = await ctx.db.get("wishes", p.wishId);
        if (wish) wishesById[p.wishId] = wish;
      }
    }

    // возвращаем в формате {date, wish}
    return progress.map(p => ({
      date: p.date,
      wish: wishesById[p.wishId],
    }));
  },
});

// Отметить как выполнено
export const markComplete = mutation({
  args: { wishId: v.id("wishes"), date: v.string(), userId: v.id("users") },
  handler: async (ctx, { wishId, date, userId }) => {
    // Проверим, есть ли запись
    const existing = await ctx.db
      .query("wishProgress")
      .filter(q =>
        q.and(
          q.eq(q.field("wishId"), wishId),
          q.eq(q.field("date"), date),
          q.eq(q.field("completedBy"), userId)
        )
      )
      .first();

    if (!existing) {
      await ctx.db.insert("wishProgress", {
        wishId,
        date,
        completedBy: userId,
        createdAt: Date.now(),
      });
    }
  },
});

// Снять отметку
export const unmarkComplete = mutation({
  args: { wishId: v.id("wishes"), date: v.string(), userId: v.id("users") },
  handler: async (ctx, { wishId, date, userId }) => {
    const existing = await ctx.db
      .query("wishProgress")
      .filter(q =>
        q.and(
          q.eq(q.field("wishId"), wishId),
          q.eq(q.field("date"), date),
          q.eq(q.field("completedBy"), userId)
        )
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
