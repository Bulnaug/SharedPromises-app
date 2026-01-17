import { QueryCtx, MutationCtx } from "../_generated/server";

export async function getCurrentUser(
  ctx: QueryCtx | MutationCtx
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .filter(q => q.eq(q.field("externalId"), identity.subject))
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
