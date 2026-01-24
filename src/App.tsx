import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import React from "react";


// Страницы
import Landing from "./pages/Landing";
import RoomsPage from "./pages/RoomsPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const me = useQuery(api.users.getMe);
  const getOrCreateMe = useMutation(api.users.getOrCreateMe);

  // Создаём пользователя в Convex, если его ещё нет
  // Делать только один раз после login
  React.useEffect(() => {
    if (me === null) {
      getOrCreateMe();
    }
  }, [me, getOrCreateMe]);

  return (
    <BrowserRouter>
      {/* Не залогиненные */}
      <SignedOut>
        <Routes>
          <Route path="*" element={<Landing />} />
        </Routes>
      </SignedOut>

      {/* Залогиненные */}
      <SignedIn>
        {me === undefined && <div className="p-6">Loading...</div>}
        {me && (
          <Routes>
            {/* Редирект с корня */}
            <Route path="/" element={<Navigate to="/rooms" replace />} />
            
            {/* Страница списка комнат */}
            <Route path="/rooms" element={<RoomsPage />} />

            {/* Dashboard выбранной комнаты */}
            <Route path="/rooms/:roomId" element={<Dashboard />} />

            {/* Любой другой путь → редирект на список комнат */}
            <Route path="*" element={<Navigate to="/rooms" replace />} />
          </Routes>
        )}
      </SignedIn>
    </BrowserRouter>
  );
}
