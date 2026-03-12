import { Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CalendarDays, CheckCircle2, Circle, Plus } from "lucide-react";

export default function TasksPage() {
  const tasks = useQuery(api.tasks.listMyTasks);
  const toggleTaskCompleted = useMutation(api.tasks.toggleTaskCompleted);

  if (tasks === undefined) {
    return <div className="text-slate-500">Загрузка задач...</div>;
  }

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="space-y-8">
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
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 shadow-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Новая задача</span>
        </Link>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Circle size={18} className="text-emerald-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Активные задачи
          </h2>
        </div>

        <div className="space-y-3">
          {activeTasks.map((task) => (
            <div
              key={task._id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                  <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
                    {task.title}
                  </h3>

                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <CalendarDays size={15} />
                      <span>{task.dueDate}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleTaskCompleted({ taskId: task._id })}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  Готово
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Выполненные
          </h2>
        </div>

        <div className="space-y-3">
          {completedTasks.map((task) => (
            <div
              key={task._id}
              className="rounded-2xl border border-slate-200 bg-white p-4 opacity-80 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                  <h3 className="text-base font-medium line-through text-slate-500 dark:text-slate-400">
                    {task.title}
                  </h3>

                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                      <CalendarDays size={15} />
                      <span>{task.dueDate}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleTaskCompleted({ taskId: task._id })}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  Вернуть
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}