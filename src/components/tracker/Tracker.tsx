import { useMemo, useState } from "react";
import dayjs from "dayjs";

import { DayDot } from "./DayDot";
import { DayDetailsModal } from "./DayDetailsModal";

type Wish = {
  _id: string;
  title: string;
  completedDates: string[];
};

export type TrackerProps = {
  startDate: string; // первый день трекера
  wishes: Wish[];    // все желания пары
};

type Day = {
  key: string;       // YYYY-MM-DD
  date: string;
  isFuture: boolean;
};

export function Tracker({ startDate, wishes }: TrackerProps) {
  // Создаём массив дней с startDate до сегодня (30 дней)
  const days: Day[] = useMemo(() => {
    const start = dayjs(startDate);
    return Array.from({ length: 30 }, (_, i) => {
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

  return (
    <>
      {/* Сетка точек 30 дней */}
      <div className="grid grid-cols-6 gap-2">
        {days.map((day) => {
          const totalWishes = wishes.length;
          const completedWishes = wishes.filter((w) =>
            w.completedDates.includes(day.date)
          ).length;

          // Цвет точки: серый=0%, желтый=частично, зеленый=100%
          let colorClass = "bg-gray-300";
          if (completedWishes === totalWishes && totalWishes > 0) colorClass = "bg-green-500";
          else if (completedWishes > 0) colorClass = "bg-yellow-400";

          return (
            <DayDot
              key={day.key}
              date={dayjs(day.date)}
              isFuture={day.isFuture}
              colorClass={colorClass}
              onClick={() => {
                if (!day.isFuture) setSelectedDayKey(day.key);
              }}
            />
          );
        })}
      </div>

      {/* Модальное окно с деталями дня */}
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
