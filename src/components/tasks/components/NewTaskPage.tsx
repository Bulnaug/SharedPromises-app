import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays } from "lucide-react";

export default function NewTaskPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-3">
        <Link
          to="/tasks"
          className="
            inline-flex items-center gap-2 text-sm
            text-slate-500 transition hover:text-slate-700
            dark:text-slate-400 dark:hover:text-slate-200
          "
        >
          <ArrowLeft size={16} />
          Назад к задачам
        </Link>

        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Новая задача
          </h1>
          <p className="mt-1 text-sm md:text-base text-slate-500 dark:text-slate-400">
            Пока это базовая форма, позже подключим сохранение и логику
          </p>
        </div>
      </div>

      <div
        className="
          rounded-3xl border border-slate-200 bg-white p-5 md:p-6
          shadow-sm dark:border-slate-800 dark:bg-slate-950
        "
      >
        <form className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Название задачи
            </label>
            <input
              id="title"
              type="text"
              placeholder="Например: Подготовить презентацию"
              className="
                w-full rounded-xl border border-slate-200
                bg-white px-4 py-3 text-slate-900 outline-none
                transition placeholder:text-slate-400
                focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100
              "
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Описание
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Короткое описание задачи..."
              className="
                w-full resize-none rounded-xl border border-slate-200
                bg-white px-4 py-3 text-slate-900 outline-none
                transition placeholder:text-slate-400
                focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100
              "
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Дата
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="dueDate"
                type="date"
                className="
                  w-full rounded-xl border border-slate-200
                  bg-white py-3 pl-11 pr-4 text-slate-900 outline-none
                  transition
                  focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100
                "
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              to="/tasks"
              className="
                inline-flex items-center justify-center rounded-xl
                border border-slate-200 px-4 py-3 text-sm font-medium
                text-slate-700 transition hover:bg-slate-50
                dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900
              "
            >
              Отмена
            </Link>

            <button
              type="submit"
              className="
                inline-flex items-center justify-center rounded-xl
                bg-emerald-500 px-4 py-3 text-sm font-medium text-white
                transition hover:bg-emerald-600
              "
            >
              Создать задачу
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}