import dayjs from "dayjs";

export function calculateWishStreak(wish: { completedDates: string[] }) {
  if (wish.completedDates.length === 0) return 0;

  const today = dayjs();
  let count = 0;
  let day = today;

  while (true) {
    const dateStr = day.format("YYYY-MM-DD");
    if (wish.completedDates.includes(dateStr)) {
      count++;
      day = day.subtract(1, "day");
    } else {
      break;
    }
  }

  return count;
}
