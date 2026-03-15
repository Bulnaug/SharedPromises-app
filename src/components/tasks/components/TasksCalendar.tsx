import { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";

type Task = {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: number;
};

type TasksCalendarProps = {
  tasks: Task[];
};

type CalendarDay = {
  key: string;
  date: string;
  isToday: boolean;
  isCurrentMonth: boolean;
};

function startOfCalendarGrid(month: dayjs.Dayjs) {
  const first = month.startOf("month");
  const dow = first.day(); // 0=Sun ... 6=Sat
  const mondayIndex = (dow + 6) % 7; // Mon=0 ... Sun=6
  return first.subtract(mondayIndex, "day");
}

function formatDateLabel(date: string) {
  return dayjs(date).format("D MMMM YYYY");
}

function isOverdue(task: Task) {
  if (!task.dueDate || task.completed) return false;
  return dayjs(task.dueDate).isBefore(dayjs().startOf("day"), "day");
}

export function TasksCalendar({ tasks }: TasksCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();

    for (const task of tasks) {
      if (!task.dueDate) continue;

      const normalized = dayjs(task.dueDate).format("YYYY-MM-DD");
      const existing = map.get(normalized) ?? [];
      existing.push(task);
      map.set(normalized, existing);
    }

    for (const [key, list] of map.entries()) {
      list.sort((a, b) => {
        if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
        return b.createdAt - a.createdAt;
      });
      map.set(key, list);
    }

    return map;
  }, [tasks]);

  const days = useMemo(() => {
    const start = startOfCalendarGrid(currentMonth);
    const result: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const d = start.add(i, "day");
      result.push({
        key: d.format("YYYY-MM-DD"),
        date: d.format("YYYY-MM-DD"),
        isToday: d.isSame(dayjs(), "day"),
        isCurrentMonth: d.isSame(currentMonth, "month"),
      });
    }

    return result;
  }, [currentMonth]);

  const selectedTasks = tasksByDate.get(selectedDate) ?? [];
  const undatedTasks = tasks.filter((task) => !task.dueDate);

  return (
    <div
      className="
        rounded-2xl border p-5 md:p-6 shadow-sm
        bg-white border-gray-100
        dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
        space-y-5
      "
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Календарь задач
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Смотри, в какие дни есть дедлайны
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth((prev) => prev.subtract(1, "month"))}
            className="
              rounded-xl border p-2
              border-gray-200 bg-white text-slate-700 transition hover:bg-slate-50
              dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
            "
            aria-label="Предыдущий месяц"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="min-w-[140px] text-center text-sm font-medium text-slate-900 dark:text-slate-100">
            {currentMonth.format("MMMM YYYY")}
          </div>

          <button
            type="button"
            onClick={() => setCurrentMonth((prev) => prev.add(1, "month"))}
            className="
              rounded-xl border p-2
              border-gray-200 bg-white text-slate-700 transition hover:bg-slate-50
              dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
            "
            aria-label="Следующий месяц"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayTasks = tasksByDate.get(day.date) ?? [];
          const total = dayTasks.length;
          const completed = dayTasks.filter((task) => task.completed).length;
          const overdue = dayTasks.filter((task) => isOverdue(task)).length;
          const selected = selectedDate === day.date;

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => setSelectedDate(day.date)}
              className={[
                `
                min-h-[84px] rounded-2xl border p-2 text-left transition
                `,
                day.isCurrentMonth
                  ? "border-gray-100 bg-white hover:bg-slate-50 dark:border-slate-700/60 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                  : "border-gray-100/60 bg-slate-50/70 text-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-500 dark:hover:bg-slate-900/50",
                selected
                  ? "ring-2 ring-emerald-500/30 border-emerald-300 dark:border-emerald-500/40"
                  : "",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={[
                    "text-sm font-medium",
                    day.isToday
                      ? "inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white"
                      : "text-slate-900 dark:text-slate-100",
                  ].join(" ")}
                >
                  {dayjs(day.date).date()}
                </span>

                {total > 0 && (
                  <span
                    className="
                      rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600
                      dark:bg-slate-800 dark:text-slate-300
                    "
                  >
                    {total}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {total > 0 && (
                  <>
                    <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                    {completed > 0 && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                    {overdue > 0 && (
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                    )}
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div
        className="
          rounded-2xl border p-4
          border-gray-100 bg-slate-50/70
          dark:border-slate-700/60 dark:bg-slate-900/40
        "
      >
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays size={16} className="text-emerald-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {formatDateLabel(selectedDate)}
          </h3>
        </div>

        {selectedTasks.length === 0 ? (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            На этот день задач нет
          </div>
        ) : (
          <div className="space-y-2">
            {selectedTasks.map((task) => (
              <div
                key={task._id}
                className="
                  rounded-xl border p-3
                  border-gray-100 bg-white
                  dark:border-slate-700/60 dark:bg-slate-900/60
                "
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5 shrink-0">
                    {task.completed ? (
                      <CheckCircle2 size={17} className="text-emerald-500" />
                    ) : (
                      <Circle size={17} className="text-slate-300 dark:text-slate-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div
                      className={[
                        "text-sm font-medium",
                        task.completed
                          ? "line-through text-slate-500 dark:text-slate-400"
                          : "text-slate-900 dark:text-slate-100",
                      ].join(" ")}
                    >
                      {task.title}
                    </div>

                    {task.description && (
                      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {task.description}
                      </div>
                    )}

                    {!task.completed && isOverdue(task) && (
                      <div className="mt-2 text-xs font-medium text-rose-500">
                        Просрочено
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {undatedTasks.length > 0 && (
        <div
          className="
            rounded-2xl border p-4
            border-gray-100 bg-white
            dark:border-slate-700/60 dark:bg-slate-900/40
          "
        >
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Без даты
          </h3>

          <div className="space-y-2">
            {undatedTasks.map((task) => (
              <div
                key={task._id}
                className="
                  rounded-xl border p-3
                  border-gray-100 bg-slate-50/70
                  dark:border-slate-700/60 dark:bg-slate-900/60
                "
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5 shrink-0">
                    {task.completed ? (
                      <CheckCircle2 size={17} className="text-emerald-500" />
                    ) : (
                      <Circle size={17} className="text-slate-300 dark:text-slate-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div
                      className={[
                        "text-sm font-medium",
                        task.completed
                          ? "line-through text-slate-500 dark:text-slate-400"
                          : "text-slate-900 dark:text-slate-100",
                      ].join(" ")}
                    >
                      {task.title}
                    </div>

                    {task.description && (
                      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {task.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}