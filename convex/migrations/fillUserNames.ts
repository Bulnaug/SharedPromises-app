import { mutation } from "../_generated/server";

export const fillUserNames = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    let updated = 0;

    for (const user of users) {
      if (user.name) continue;

      await ctx.db.patch(user._id, {
        name: "User",
      });

      updated++;
    }

    return { updated };
  },
});
