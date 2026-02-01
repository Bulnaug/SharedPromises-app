import { today } from "./date"

type Habit = {
  completedDates: string[]
}

export const calculateDailyProgress = (habits: Habit[]): number => {
  if (habits.length === 0) return 0

  const t = today()
  const doneToday = habits.filter(h =>
    h.completedDates.includes(t)
  ).length

  return Math.round((doneToday / habits.length) * 100)
}