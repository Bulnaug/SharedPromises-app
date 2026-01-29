/* import { mutation } from "../_generated/server";

export const fillWishUserId = mutation({
  handler: async (ctx) => {
    const wishes = await ctx.db.query("wishes").collect();

    for (const wish of wishes) {
      if (!wish.userId && wish.authorId) {
        await ctx.db.patch(wish._id, {
          userId: wish.authorId,
        });
      }
    }
  },
}); */