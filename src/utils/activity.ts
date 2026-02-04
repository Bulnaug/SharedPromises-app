export type ActivityLevel = 0 | 1 | 2;

export function build30DaysActivity(
  wishes: {
    completedDates: string[];
  }[],
  strongThreshold = 3
): ActivityLevel[] {
  const today = new Date();
  const days: ActivityLevel[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dayKey = date.toISOString().slice(0, 10);

    const completedCount = wishes.filter(w =>
      w.completedDates?.includes(dayKey)
    ).length;

    if (completedCount === 0) {
      days.push(0);
    } else if (completedCount >= strongThreshold) {
      days.push(2);
    } else {
      days.push(1);
    }
  }

  return days;
}
