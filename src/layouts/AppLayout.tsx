import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { ThemeToggle } from "../components/ThemeSwitsher";
import { ModeSwitch } from "../components/ModeSwitch";

export function AppLayout() {
  return (
    <div
      className="
        h-dvh overflow-hidden
        bg-gray-50 text-slate-900
        dark:bg-slate-900 dark:text-slate-100
      "
    >
      <div className="flex h-dvh flex-col md:flex-row">
        <AppSidebar />

        <main className="min-w-0 flex-1 overflow-y-auto">
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
              "
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>

                <div className="flex justify-start">
                  <ModeSwitch />
                </div>
              </div>
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}