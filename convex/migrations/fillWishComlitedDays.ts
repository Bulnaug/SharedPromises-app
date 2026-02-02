import { mutation } from "../_generated/server";

export const fillWishesCompltedDays = mutation({
  args: {},
  handler: async (ctx) => {
    const wishes = await ctx.db.query("wishes").collect();

    let updated = 0;

    for (const wish of wishes) {
      if (wish.completedDates) continue;

      await ctx.db.patch(wish._id, {
        completedDates: []
      });

      updated++;
    }

    return { updated };
  },
});
