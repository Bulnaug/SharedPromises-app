import { Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CalendarDays, CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";

export default function TasksPage() {
  const tasks = useQuery(api.tasks.listMyTasks);
  const toggleTaskCompleted = useMutation(api.tasks.toggleTaskCompleted);
  const deleteTask = useMutation(api.tasks.deleteTask);

  if (tasks === undefined) {
    return (
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Загрузка задач...
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  const activeTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
            Мои задачи
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 md:text-base">
            Личный список задач с датами и статусом выполнения
          </p>
        </div>

        <Link
          to="/tasks/new"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Новая задача</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Всего задач
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {tasks.length}
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
                key={task._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-2">
                    <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {task.description}
                      </p>
                    )}

                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <CalendarDays size={15} />
                        <span>{task.dueDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleTaskCompleted({ taskId: task._id })}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                    >
                      Готово
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTask({ taskId: task._id })}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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
          {completedTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
              Пока нет выполненных задач
            </div>
          ) : (
            completedTasks.map((task) => (
              <div
                key={task._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 opacity-80 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-2">
                    <h3 className="text-base font-medium text-slate-500 line-through dark:text-slate-400">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-sm text-slate-400 dark:text-slate-500">
                        {task.description}
                      </p>
                    )}

                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                        <CalendarDays size={15} />
                        <span>{task.dueDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleTaskCompleted({ taskId: task._id })}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                    >
                      Вернуть
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTask({ taskId: task._id })}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}