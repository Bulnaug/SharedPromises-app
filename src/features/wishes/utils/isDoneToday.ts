export function isDoneToday(
  completedDates?: string[]
) {
  if (!completedDates) return false;

  const today = new Date()
    .toISOString()
    .slice(0, 10);

  return completedDates.includes(today);
}
