import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { useTrackerDays } from "../../hooks/useTrackerDays";
import { DayDot } from "./DayDot";
import { DayDetailsModal } from "./DayDetailsModal";

type Wish = {
  _id: string;
  title: string;
};

type ProgressItem = {
  date: string;
  wish: Wish;
};

export type TrackerProps = {
  startDate: string;
  wishes: {
    _id: string;
    completedDates: string[];
  }[];
};

export function Tracker({ startDate }: TrackerProps) {
  const days = useTrackerDays(startDate);

  const progress = useQuery(api.wishProgress.getByDateRange, {
    from: days[0].key,
    to: days[days.length - 1].key,
  }) as ProgressItem[] | undefined;

  const progressByDate = useMemo(() => {
    if (!progress) return {};

    return progress.reduce<Record<string, Wish[]>>((acc, item) => {
      if (!acc[item.date]) acc[item.date] = [];
      acc[item.date].push(item.wish);
      return acc;
    }, {});
  }, [progress]);

  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const selectedDay = days.find(d => d.key === selectedDayKey);

  return (
    <>
      {/* Сетка точек */}
      <div className="grid grid-cols-6 gap-3">
        {days.map(day => (
          <DayDot
            key={day.key}
            date={day.date}
            hasWishes={(progressByDate[day.key]?.length ?? 0) > 0}
            isFuture={day.isFuture}
            onClick={() => {
              if (!day.isFuture) setSelectedDayKey(day.key);
            }}
          />
        ))}
      </div>

      {/* Модалка */}
      {selectedDay && (
        <DayDetailsModal
          date={selectedDay.date}
          wishes={progressByDate[selectedDay.key] || []}
          onClose={() => setSelectedDayKey(null)}
        />
      )}
    </>
  );
}
