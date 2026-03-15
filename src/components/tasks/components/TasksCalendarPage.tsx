import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { TasksCalendar } from "../components/TasksCalendar";

export default function TasksCalendarPage() {
  const tasks = useQuery(api.tasks.listMyTasks);

  if (tasks === undefined) {
    return (
      <div
        className="
          rounded-2xl border px-5 py-4 shadow-sm
          bg-white border-gray-100
          dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
        "
      >
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Загрузка календаря...
        </div>
      </div>
    );
  }

  return <TasksCalendar tasks={tasks} />;
}