/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as lib_getUser from "../lib/getUser.js";
import type * as migrations_cleanupAuthorId from "../migrations/cleanupAuthorId.js";
import type * as migrations_fillInviteCodes from "../migrations/fillInviteCodes.js";
import type * as migrations_fillUserNames from "../migrations/fillUserNames.js";
import type * as migrations_fillWishComlitedDays from "../migrations/fillWishComlitedDays.js";
import type * as migrations_fillWishUserId from "../migrations/fillWishUserId.js";
import type * as migrations_index from "../migrations/index.js";
import type * as migrations_ownerIntoMember from "../migrations/ownerIntoMember.js";
import type * as rooms from "../rooms.js";
import type * as users from "../users.js";
import type * as wishProgress from "../wishProgress.js";
import type * as wishes from "../wishes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "lib/getUser": typeof lib_getUser;
  "migrations/cleanupAuthorId": typeof migrations_cleanupAuthorId;
  "migrations/fillInviteCodes": typeof migrations_fillInviteCodes;
  "migrations/fillUserNames": typeof migrations_fillUserNames;
  "migrations/fillWishComlitedDays": typeof migrations_fillWishComlitedDays;
  "migrations/fillWishUserId": typeof migrations_fillWishUserId;
  "migrations/index": typeof migrations_index;
  "migrations/ownerIntoMember": typeof migrations_ownerIntoMember;
  rooms: typeof rooms;
  users: typeof users;
  wishProgress: typeof wishProgress;
  wishes: typeof wishes;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
