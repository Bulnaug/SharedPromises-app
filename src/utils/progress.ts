import { isDoneToday } from "./isDoneToday";

export function calcProgress(wishes: { completedDates: string[] }[]) {
  if (wishes.length === 0) return 0;

  const doneToday = wishes.filter(w =>
    isDoneToday(w.completedDates)
  ).length;

  return Math.round(
    (doneToday / wishes.length) * 100
  );
}