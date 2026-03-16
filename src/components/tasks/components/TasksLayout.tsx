import { Outlet } from "react-router-dom";
import { TasksSidebar } from "./TasksSidebar";
import LanguageSwitcher from "../../LanguageSwitcher";
import { ThemeToggle } from "../../ThemeSwitsher";
import { ModeSwitch } from "../../ModeSwitch";

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
            <div
              className="
                sticky top-0 z-40
                -mx-2 md:-mx-6
                px-2 md:px-6
                py-3
                bg-gray-50/90 dark:bg-slate-900/85
                backdrop-blur
                border-b border-gray-200/60 dark:border-slate-700/60
                flex items-center justify-between gap-4
              "
            >
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <div className="flex justify-start">
              <ModeSwitch />
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}