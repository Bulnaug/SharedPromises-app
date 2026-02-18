import { mutation } from "../_generated/server";

export const migrateAddInviteCodes = mutation({
  handler: async (ctx) => {
    const rooms = await ctx.db.query("rooms").collect();

    for (const room of rooms) {
      if (!room.inviteCode) {
        await ctx.db.patch(room._id, {
          inviteCode: Math.random()
            .toString(36)
            .substring(2, 10),
        });
      }
    }

    return "Migration completed";
  },
});
