import { Link, useLocation } from "react-router-dom";
import { CheckSquare, HeartHandshake } from "lucide-react";

export function ModeSwitch() {
  const { pathname } = useLocation();

  const isTasks = pathname.startsWith("/tasks");
  const isRooms =
    pathname.startsWith("/rooms") ||
    pathname.startsWith("/profile") ||
    pathname === "/";

  return (
    <div
      className="
        inline-flex items-center gap-1
        rounded-2xl border border-gray-200/70 bg-white p-1 shadow-sm
        dark:border-slate-700/60 dark:bg-slate-800/70
      "
    >
      <Link
        to="/rooms"
        className={[
          `
          inline-flex items-center gap-2 rounded-xl
          px-4 py-2.5 text-sm font-medium transition
          `,
          isRooms
            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/70",
        ].join(" ")}
      >
        <HeartHandshake size={16} />
        <span>Привычки</span>
      </Link>

      <Link
        to="/tasks"
        className={[
          `
          inline-flex items-center gap-2 rounded-xl
          px-4 py-2.5 text-sm font-medium transition
          `,
          isTasks
            ? "bg-emerald-500 text-white"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/70",
        ].join(" ")}
      >
        <CheckSquare size={16} />
        <span>Задачи</span>
      </Link>
    </div>
  );
}