import type { Id } from "../../../convex/_generated/dataModel";

export type Wish = {
  _id: Id<"wishes">;
  title: string;
  completedDates: string[];
};

export type FeedbackType = "saved" | "added" | "deleted";

export type Feedback = {
  type: FeedbackType;
  text: string;
};
