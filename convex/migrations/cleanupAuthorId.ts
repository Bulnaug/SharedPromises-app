/* // convex/migrations/cleanupAuthorId.ts
import { mutation } from "../_generated/server";

export const cleanupAuthorId = mutation({
  handler: async (ctx) => {
    const wishes = await ctx.db.query("wishes").collect();

    for (const wish of wishes) {
      if ("authorId" in wish) {
        await ctx.db.patch(wish._id, {
          authorId: undefined,
        });
      }
    }
  },
});
 */