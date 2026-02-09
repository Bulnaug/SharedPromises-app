import type { Id } from "../../../convex/_generated/dataModel";

export type Wish = {
  _id: Id<"wishes">;
  title: string;
  completedDates: string[];
};
