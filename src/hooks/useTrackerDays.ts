import dayjs from "dayjs";
import { useMemo } from "react";

export function useTrackerDays(startDate: string) {
  return useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = dayjs(startDate).add(i, "day");

      return {
        date,
        key: date.format("YYYY-MM-DD"),
        isFuture: date.isAfter(dayjs(), "day"),
      };
    });
  }, [startDate]);
}
