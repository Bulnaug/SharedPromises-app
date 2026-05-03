import { Outlet } from "react-router-dom";
import { TasksSidebar } from "../components/TasksSidebar";

export function TasksLayout() {
  return (
    <div
      className="
        h-dvh overflow-hidden
        bg-gray-50 text-slate-900
        dark:bg-slate-900 dark:text-slate-100
      "
    >
      <div className="flex flex-col md:flex-row h-dvh">
        <TasksSidebar />

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div
            className="
              mx-auto w-full max-w-4xl
              px-2 md:px-6
              pb-6 md:pb-10
              space-y-8
            "
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
