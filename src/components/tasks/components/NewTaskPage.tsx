import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ArrowLeft, CalendarDays } from "lucide-react";

export default function NewTaskPage() {
  const navigate = useNavigate();
  const createTask = useMutation(api.tasks.createTask);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);

      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
      });

      navigate("/tasks");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="relative space-y-8 text-slate-900 dark:text-slate-100">
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
              Добавь задачу с названием, описанием и датой
            </p>
          </div>
        </div>

        <div
          className="
            rounded-3xl border border-slate-200 bg-white p-5 shadow-sm
            dark:border-slate-800 dark:bg-slate-950 md:p-6
          "
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Название
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Подготовить презентацию"
                className="
                  w-full rounded-xl border border-slate-200 bg-white
                  px-4 py-3 text-slate-900 outline-none transition
                  placeholder:text-slate-400
                  focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100
                "
              />
            </div>

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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Короткое описание задачи..."
                className="
                  w-full resize-none rounded-xl border border-slate-200 bg-white
                  px-4 py-3 text-slate-900 outline-none transition
                  placeholder:text-slate-400
                  focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100
                "
              />
            </div>

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
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="
                    w-full rounded-xl border border-slate-200 bg-white
                    py-3 pl-11 pr-4 text-slate-900 outline-none transition
                    focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100
                  "
                />
              </div>
            </div>

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
                disabled={isSubmitting || !title.trim()}
                className="
                  inline-flex items-center justify-center rounded-xl
                  bg-emerald-500 px-4 py-3 text-sm font-medium text-white
                  transition hover:bg-emerald-600
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                {isSubmitting ? "Создание..." : "Создать задачу"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}