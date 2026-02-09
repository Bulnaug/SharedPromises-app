import { useMemo, useState } from "react";
import dayjs from "dayjs";

import { DayDot } from "./DayDot";
import { DayDetailsModal } from "./DayDetailsModal";

type Wish = {
  _id: string;
  title: string;
  createdAt: number;      // timestamp
  completedDates: string[];
};

export type TrackerProps = {
  startDate: string;
  wishes: Wish[];
};

type Day = {
  key: string;
  date: string;
  isFuture: boolean;
};

export function Tracker({ startDate, wishes }: TrackerProps) {
  const days: Day[] = useMemo(() => {
    const start = dayjs(startDate);
    return Array.from({ length: 35 }, (_, i) => {
      const date = start.add(i, "day");
      return {
        key: date.format("YYYY-MM-DD"),
        date: date.format("YYYY-MM-DD"),
        isFuture: date.isAfter(dayjs(), "day"),
      };
    });
  }, [startDate]);

  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const selectedDay = days.find((d) => d.key === selectedDayKey);

  // Группируем желания по дате для модалки
  const wishesByDate = useMemo(() => {
    const map: Record<string, Wish[]> = {};
    wishes.forEach((wish) => {
      wish.completedDates.forEach((date) => {
        if (!map[date]) map[date] = [];
        map[date].push(wish);
      });
    });
    return map;
  }, [wishes]);

  // 🔹 Подсчёт стрика
  const streak = useMemo(() => {
    let count = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      const day = days[i];
      const relevantWishes = wishes.filter((w) => {
        const createdAtDate = dayjs(w.createdAt).format("YYYY-MM-DD");
        return createdAtDate <= day.date;
      });

      const totalWishes = relevantWishes.length;
      const completedWishes = relevantWishes.filter((w) =>
        w.completedDates.includes(day.date)
      ).length;

      if (totalWishes > 0 && completedWishes === totalWishes) {
        count++;
      } else {
        break; // стрик прервался
      }
    }
    return count;
  }, [days, wishes]);

  return (
    <>
      {/* Стрик */}
      {streak > 0 && (
        <div className="text-center font-semibold text-green-600 mb-2">
          🔥 {streak} {streak === 1 ? "день" : "дня"} подряд с 100% выполнением!
        </div>
      )}

      {/* Сетка точек 30 дней */}
      <div className="
        grid
        grid-cols-7
        gap-2
        max-w-xs
      ">
        {days.map((day) => {
          const relevantWishes = wishes.filter((w) => {
            const createdAtDate = dayjs(w.createdAt).format("YYYY-MM-DD");
            return createdAtDate <= day.date;
          });

          const totalWishes = relevantWishes.length;
          const completedWishes = relevantWishes.filter((w) =>
            w.completedDates.includes(day.date)
          ).length;

          let colorClass = "bg-gray-300";
          if (completedWishes === totalWishes && totalWishes > 0) colorClass = "bg-green-500";
          else if (completedWishes > 0) colorClass = "bg-yellow-400";

          return (
            <DayDot
              key={day.key}
              date={dayjs(day.date)}
              isFuture={day.isFuture}
              colorClass={colorClass}
              onClick={() => !day.isFuture && setSelectedDayKey(day.key)}
            />
          );
        })}
      </div>

      {/* Модальное окно */}
      {selectedDay && (
        <DayDetailsModal
          date={dayjs(selectedDay.date)}
          wishes={wishesByDate[selectedDay.key] || []}
          onClose={() => setSelectedDayKey(null)}
        />
      )}
    </>
  );
}
