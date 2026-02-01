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
import type * as migrations_fillUserNames from "../migrations/fillUserNames.js";
import type * as migrations_fillWishUserId from "../migrations/fillWishUserId.js";
import type * as migrations_index from "../migrations/index.js";
import type * as rooms from "../rooms.js";
import type * as users from "../users.js";
import type * as wishes from "../wishes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "lib/getUser": typeof lib_getUser;
  "migrations/cleanupAuthorId": typeof migrations_cleanupAuthorId;
  "migrations/fillUserNames": typeof migrations_fillUserNames;
  "migrations/fillWishUserId": typeof migrations_fillWishUserId;
  "migrations/index": typeof migrations_index;
  rooms: typeof rooms;
  users: typeof users;
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
