import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import AddWishPage from "./pages/AddWishPage";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { usePartnerNotifications } from "./hooks/usePartnerNotifications";

export default function App() {
  const me = useQuery(api.users.getMe);
  usePartnerNotifications();

  // состояние текущей страницы
  const [page, setPage] = useState<"dashboard" | "add">("dashboard");

  if (!me) return <div>Loading...</div>;

  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-gray-100 p-4 space-y-4 flex flex-col">
            <button
              onClick={() => setPage("dashboard")}
              className={`px-4 py-2 rounded text-left ${
                page === "dashboard" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
            >
              Dashboard
            </button>

            {me.role === "author" && (
              <button
                onClick={() => setPage("add")}
                className={`px-4 py-2 rounded text-left ${
                  page === "add" ? "bg-black text-white" : "hover:bg-gray-200"
                }`}
              >
                Добавить желание
              </button>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4">
            {page === "dashboard" && <Dashboard />}
            {page === "add" && <AddWishPage />}
          </div>
        </div>
      </SignedIn>
    </>
  );
}
