import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl flex">
        <AppSidebar />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}