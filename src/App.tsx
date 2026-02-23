import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddWishPage from "./pages/AddWishPage";
import JoinRoom from "./components/JoinRoom";
import ProfilePage from "./pages/ProfilPage";
import RoomSettingsRoute from "./pages/RoomSettingsRoute";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useRef } from "react";

// Страницы
import Landing from "./pages/Landing";
import RoomsPage from "./pages/RoomsPage";
import Dashboard from "./pages/Dashboard";

// ✅ Layout
import { AppLayout } from "./layouts/AppLayout";

export default function App() {
  const { isLoaded, isSignedIn } = useAuth();

  const me = useQuery(api.users.getMe);
  const getOrCreateMe = useMutation(api.users.createMe);

  const createdRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;
    if (me !== null) return;
    if (createdRef.current) return;

    createdRef.current = true;
    getOrCreateMe();
  }, [isLoaded, isSignedIn, me, getOrCreateMe]);

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
        {me === undefined && <div>Loading...</div>}

        {me && (
          <Routes>
            <Route path="/" element={<Navigate to="/rooms" />} />

            <Route path="/join/:inviteCode" element={<JoinRoom />} />

            {/* ✅ Глобальные страницы с AppSidebar */}
            <Route element={<AppLayout />}>
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* если у тебя появится /rooms/new — добавишь сюда */}
            </Route>

            {/* 🏠 Страницы комнаты — без AppLayout */}
            <Route path="/rooms/:roomId/new" element={<AddWishPage />} />
            <Route path="/rooms/:roomId" element={<Dashboard />} />
            <Route
              path="/rooms/:roomId/settings"
              element={<RoomSettingsRoute />}
            />

            <Route path="*" element={<Navigate to="/rooms" />} />
          </Routes>
        )}
      </SignedIn>
    </BrowserRouter>
  );
}