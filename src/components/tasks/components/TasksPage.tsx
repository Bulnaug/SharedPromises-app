import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, Circle, Plus } from "lucide-react";

type Task = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
};

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Купить продукты",
    dueDate: "2026-03-10",
    completed: false,
  },
  {
    id: "2",
    title: "Закончить дизайн главной страницы",
    dueDate: "2026-03-11",
    completed: false,
  },
  {
    id: "3",
    title: "Оплатить подписку",
    dueDate: "2026-03-08",
    completed: true,
  },
];

export default function TasksPage() {
  const activeTasks = mockTasks.filter((task) => !task.completed);
  const completedTasks = mockTasks.filter((task) => task.completed);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Мои задачи
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
            Личный список задач с датами и статусом выполнения
          </p>
        </div>

        <Link
          to="/tasks/new"
          className="
            inline-flex items-center gap-2 rounded-xl
            bg-emerald-500 px-4 py-2.5
            text-sm font-medium text-white
            transition hover:bg-emerald-600
            shadow-sm
          "
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Новая задача</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Всего задач
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {mockTasks.length}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Активные
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {activeTasks.length}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Выполненные
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {completedTasks.length}
          </div>
        </div>
      </div>

      {/* Active tasks */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Circle size={18} className="text-emerald-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Активные задачи
          </h2>
        </div>

        <div className="space-y-3">
          {activeTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
              Пока нет активных задач
            </div>
          ) : (
            activeTasks.map((task) => (
              <div
                key={task.id}
                className="
                  rounded-2xl border border-slate-200 bg-white p-4
                  shadow-sm transition hover:shadow-md
                  dark:border-slate-800 dark:bg-slate-950
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <Circle size={18} className="text-slate-400" />
                      <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
                        {task.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <CalendarDays size={15} />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="
                      rounded-lg border border-slate-200 px-3 py-1.5
                      text-sm text-slate-600 transition hover:bg-slate-50
                      dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900
                    "
                  >
                    Открыть
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Completed tasks */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Выполненные
          </h2>
        </div>

        <div className="space-y-3">
          {completedTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
              Пока нет выполненных задач
            </div>
          ) : (
            completedTasks.map((task) => (
              <div
                key={task.id}
                className="
                  rounded-2xl border border-slate-200 bg-white p-4
                  shadow-sm opacity-80
                  dark:border-slate-800 dark:bg-slate-950
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      <h3 className="text-base font-medium line-through text-slate-500 dark:text-slate-400">
                        {task.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                      <CalendarDays size={15} />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="
                      rounded-lg border border-slate-200 px-3 py-1.5
                      text-sm text-slate-600 transition hover:bg-slate-50
                      dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900
                    "
                  >
                    Открыть
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}