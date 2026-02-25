import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import LanguageSwitcher from "../components/LanguageSwitcher";

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-gray-50 overflow-x-hidden">
      <div className="flex flex-col md:flex-row min-h-dvh">
        <AppSidebar />

        <main className="flex-1">
          <div className="mx-auto w-full max-w-4xl px-2 md:px-6 py-6 md:py-10 space-y-8">
            <LanguageSwitcher />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}