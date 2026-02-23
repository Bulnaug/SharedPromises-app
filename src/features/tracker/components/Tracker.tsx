import { useMemo, useState } from "react";
import dayjs from "dayjs";

import { DayDetailsModal } from "./DayDetailsModal";

type Wish = {
  _id: string;
  title: string;
  createdAt: number;
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
  isBeforeStart: boolean;
  isInMonth: boolean;
  isToday: boolean;
};

function startOfCalendarGrid(month: dayjs.Dayjs) {
  // Пн - первый день недели
  const first = month.startOf("month");
  const dow = first.day(); // 0=Вс ... 6=Сб
  const mondayIndex = (dow + 6) % 7; // Пн=0 ... Вс=6
  return first.subtract(mondayIndex, "day");
}

export function Tracker({ startDate, wishes }: TrackerProps) {
  const start = useMemo(() => dayjs(startDate).startOf("day"), [startDate]);
  const [monthCursor, setMonthCursor] = useState(() => dayjs().startOf("month"));

  const days: Day[] = useMemo(() => {
    const gridStart = startOfCalendarGrid(monthCursor);
    const today = dayjs().startOf("day");

    return Array.from({ length: 42 }, (_, i) => {
      const d = gridStart.add(i, "day");
      const dateStr = d.format("YYYY-MM-DD");

      return {
        key: dateStr,
        date: dateStr,
        isFuture: d.isAfter(today, "day"),
        isBeforeStart: d.isBefore(start, "day"),
        isInMonth: d.month() === monthCursor.month(),
        isToday: d.isSame(today, "day"),
      };
    });
  }, [monthCursor, start]);

  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const selectedDay = days.find((d) => d.key === selectedDayKey);

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

  const getRelevantWishes = (dateStr: string) =>
    wishes.filter((w) => dayjs(w.createdAt).format("YYYY-MM-DD") <= dateStr);

  const streak = useMemo(() => {
    const today = dayjs().startOf("day");
    let count = 0;

    for (let i = 0; ; i++) {
      const d = today.subtract(i, "day");
      if (d.isBefore(start, "day")) break;

      const dateStr = d.format("YYYY-MM-DD");
      const relevant = getRelevantWishes(dateStr);
      const total = relevant.length;
      const completed = relevant.filter((w) => w.completedDates.includes(dateStr)).length;

      if (total > 0 && completed === total) count++;
      else break;
    }

    return count;
  }, [wishes, start]);

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <>
      {/* Header */}
      <div className="w-full flex justify-center mb-3">
        <div className="w-[260px] sm:w-[280px] flex items-center justify-between">
          <button
            type="button"
            className="h-9 w-9 text-gray-900 grid place-items-center"
            onClick={() => setMonthCursor((m) => m.subtract(1, "month"))}
            aria-label="Предыдущий месяц"
          >
            ←
          </button>

          <div className="text-sm font-semibold text-gray-900">
            {monthCursor.format("MMMM YYYY")}
          </div>

          <button
            type="button"
            className="h-9 w-9 text-gray-900 grid place-items-center"
            onClick={() => setMonthCursor((m) => m.add(1, "month"))}
            aria-label="Следующий месяц"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="w-full flex justify-center">
        <div className="w-fit">
          <div className="grid grid-cols-7 gap-2">
            {/* weekdays */}
            {weekDays.map((wd) => (
              <div
                key={wd}
                className="text-[10px] text-gray-400 text-center select-none leading-none pb-1"
              >
                {wd}
              </div>
            ))}

            {days.map((day) => {
              const relevant = getRelevantWishes(day.date);
              const total = relevant.length;
              const completed = relevant.filter((w) =>
                w.completedDates.includes(day.date)
              ).length;

              const isOutOfMonth = !day.isInMonth;
              const isDisabled = day.isFuture || day.isBeforeStart;

              // БАЗА: простая “точка”
              let cellBg = "bg-gray-100";
              let textMain = "text-gray-900";

              // раскраска по прогрессу
              if (total > 0 && completed === total) {
                cellBg = "bg-green-500";
                textMain = "text-white";
              } else if (completed > 0) {
                cellBg = "bg-yellow-400";
                textMain = "text-gray-900";
              }

              // вне месяца: максимально тихо и без интерактива
              if (isOutOfMonth) {
                return (
                  <div
                    key={day.key}
                    className="h-6 w-6 rounded-full bg-gray-50"
                    aria-hidden="true"
                  />
                );
              }

              const disabled = isDisabled;
              const fade = disabled ? "opacity-30" : "opacity-100";
              const hover = !disabled ? "hover:brightness-95 active:scale-95" : "cursor-not-allowed";

              // today — тонкий кружок
              const todayRing = day.isToday ? "ring-1 ring-black/20" : "";

              return (
                <button
                  key={day.key}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && setSelectedDayKey(day.key)}
                  className={[
                    "h-6 w-6 sm:h-6 sm:w-6",
                    "rounded-full",
                    "grid place-items-center",
                    "transition",
                    cellBg,
                    todayRing,
                    fade,
                    hover,
                  ].join(" ")}
                  aria-label={day.date}
                  title={day.date}
                >
                  <span className={["text-[11px] font-medium leading-none", textMain].join(" ")}>
                    {dayjs(day.date).date()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {streak > 0 && (
        <div className="text-center font-semibold text-green-600 mb-5 mt-5">
          🔥 {streak} {streak === 1 ? "день" : "дня"} подряд с 100% выполнением!
        </div>
      )}

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