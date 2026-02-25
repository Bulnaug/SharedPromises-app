import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

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
  const first = month.startOf("month");
  const dow = first.day(); // 0=Вс ... 6=Сб
  const mondayIndex = (dow + 6) % 7; // Пн=0 ... Вс=6
  return first.subtract(mondayIndex, "day");
}

export function Tracker({ startDate, wishes }: TrackerProps) {
  const start = useMemo(() => dayjs(startDate).startOf("day"), [startDate]);
  const [monthCursor, setMonthCursor] = useState(() => dayjs().startOf("month"));

  const { t, i18n } = useTranslation();

  useEffect(() => {
    dayjs.locale(i18n.language?.startsWith("de") ? "de" : "ru");
  }, [i18n.language]);

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

  const weekDays = t("weekDayShort", { returnObjects: true }) as string[];

  return (
    <>
      {/* Header */}
      <div className="w-full flex justify-center mb-3">
        <div className="w-[260px] sm:w-[280px] flex items-center justify-between">
          <button
            type="button"
            className="
              h-9 w-9 grid place-items-center rounded-xl transition
              text-slate-900 hover:bg-gray-100
              dark:text-slate-100 dark:hover:bg-slate-800/60
            "
            onClick={() => setMonthCursor((m) => m.subtract(1, "month"))}
            aria-label={t("prevMonth")}
            title={t("prevMonth")}
          >
            ←
          </button>

          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {monthCursor
              .locale(i18n.language?.startsWith("de") ? "de" : "ru")
              .format("MMMM YYYY")}
          </div>

          <button
            type="button"
            className="
              h-9 w-9 grid place-items-center rounded-xl transition
              text-slate-900 hover:bg-gray-100
              dark:text-slate-100 dark:hover:bg-slate-800/60
            "
            onClick={() => setMonthCursor((m) => m.add(1, "month"))}
            aria-label={t("nextMonth")}
            title={t("nextMonth")}
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="w-full flex justify-center">
        <div className="inline-block max-w-full">
          <div className="grid grid-cols-7 gap-2">
            {/* weekdays */}
            {weekDays.map((wd) => (
              <div
                key={wd}
                className="text-[10px] text-slate-400 dark:text-slate-500 text-center select-none leading-none pb-1"
              >
                {wd}
              </div>
            ))}

            {days.map((day) => {
              const relevant = getRelevantWishes(day.date);
              const total = relevant.length;
              const completed = relevant.filter((w) => w.completedDates.includes(day.date)).length;

              const isOutOfMonth = !day.isInMonth;
              const isDisabled = day.isFuture || day.isBeforeStart;

              // Base (calm)
              let cellBg = "bg-gray-100 dark:bg-slate-700/40";
              let textMain = "text-slate-900 dark:text-slate-100";

              // Progress coloring
              if (total > 0 && completed === total) {
                cellBg = "bg-emerald-500 dark:bg-emerald-400";
                textMain = "text-white dark:text-slate-900";
              } else if (completed > 0) {
                cellBg = "bg-amber-400 dark:bg-amber-400";
                textMain = "text-slate-900";
              }

              // Out of month: keep the grid calm (same size, very subtle)
              if (isOutOfMonth) {
                return (
                  <div
                    key={day.key}
                    className="h-6 w-6 rounded-full bg-gray-50 dark:bg-slate-900/30"
                    aria-hidden="true"
                  />
                );
              }

              const fade = isDisabled ? "opacity-35" : "opacity-100";
              const hover = !isDisabled
                ? "hover:brightness-95 active:scale-95"
                : "cursor-not-allowed";

              const todayRing = day.isToday
                ? "ring-1 ring-black/20 dark:ring-slate-200/20"
                : "";

              return (
                <button
                  key={day.key}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && setSelectedDayKey(day.key)}
                  className={[
                    "h-6 w-6 rounded-full grid place-items-center transition",
                    cellBg,
                    todayRing,
                    fade,
                    hover,
                    !isDisabled ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/35" : "",
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
        <div className="text-center font-semibold text-emerald-600 dark:text-emerald-300 mb-5 mt-5">
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