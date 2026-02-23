import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
        <AppSidebar />
        <main className="
            flex-1
            px-2
            py-8
            max-w-4xl
            mx-auto
            space-y-8
        ">
          <Outlet />
        </main>
      
    </div>
  );
}