import type { Id } from "../../convex/_generated/dataModel";

export type DayActivityStatus =
  | "empty"
  | "partial"
  | "full";

export type DayActivity = {
  date: string; // YYYY-MM-DD
  status: DayActivityStatus;
};

type WishLike = {
  fulfilled: boolean;
  createdAt: number;
};

export function build30DaysActivity(
  wishes: WishLike[]
): DayActivity[] {
  const days: DayActivity[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    day.setHours(23, 59, 59, 999);

    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    // желания, которые существовали в этот день
    const activeWishes = wishes.filter(
      (w) => w.createdAt <= day.getTime()
    );

    const total = activeWishes.length;
    const fulfilled = activeWishes.filter(
      (w) => w.fulfilled
    ).length;

    let status: DayActivityStatus = "empty";

    if (fulfilled > 0 && fulfilled < total) {
      status = "partial";
    }

    if (total > 0 && fulfilled === total) {
      status = "full";
    }

    days.push({
      date: day.toISOString().slice(0, 10),
      status,
    });
  }

  return days;
}
