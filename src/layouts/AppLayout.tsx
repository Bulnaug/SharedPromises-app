import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { ThemeToggle } from "../components/ThemeSwitsher";

export function AppLayout() {
  return (
    <div
      className="
        h-dvh overflow-hidden
        bg-gray-50 text-slate-900
        dark:bg-slate-900 dark:text-slate-100
      "
    >
      <div className="flex flex-col md:flex-row h-dvh">
        <AppSidebar />

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div
            className="
              mx-auto w-full max-w-4xl
              px-2 md:px-6
              py-6 md:py-10
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

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}