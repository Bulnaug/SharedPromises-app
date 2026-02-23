import { mutation } from "../_generated/server";

export const migrateOwnerIntoMembers = mutation({
  handler: async (ctx) => {
    const rooms = await ctx.db.query("rooms").collect();

    for (const room of rooms) {
      // если owner не в memberIds — добавим
      if (!room.memberIds.includes(room.ownerId)) {
        await ctx.db.patch(room._id, {
          memberIds: [room.ownerId, ...room.memberIds],
        });
      }
    }

    return "OK";
  },
});