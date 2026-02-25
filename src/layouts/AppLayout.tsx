import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { ThemeToggle } from "../components/ThemeSwitsher";

export function AppLayout() {
  return (
    <div
      className="
        min-h-dvh overflow-x-hidden
        bg-gray-50 text-slate-900
        dark:bg-slate-900 dark:text-slate-100
      "
    >
      <div className="flex flex-col md:flex-row min-h-dvh">
        <AppSidebar />

        <main className="flex-1">
          <div
            className="
              mx-auto w-full max-w-4xl
              px-2 md:px-6
              py-6 md:py-10
              space-y-8
            "
          >
            <div className="flex items-center gap-4">
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