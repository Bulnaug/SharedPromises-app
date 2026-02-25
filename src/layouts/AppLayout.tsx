import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import LanguageSwitcher from "../components/LanguageSwitcher";

export function AppLayout() {
  return (
    <div className="flex min-h-dvh bg-gray-50 overflow-x-hidden">
      <AppSidebar />

      <main
        className="
          flex-1
          px-2
          py-8
        "
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <LanguageSwitcher />
          <Outlet />
        </div>
      </main>
    </div>
  );
}