import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NewWishPage from "./pages/NewWishPage";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import React, { useEffect, useRef } from "react";

// Страницы
import Landing from "./pages/Landing";
import RoomsPage from "./pages/RoomsPage";
import Dashboard from "./pages/Dashboard";

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
        {me === undefined && <div className="p-6">Loading...</div>}

        {me && (
          <Routes>
            <Route path="/" element={<Navigate to="/rooms" replace />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:roomId" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/rooms" replace />} />
            <Route path="/rooms/:roomId/new" element={<NewWishPage />} />
          </Routes>
        )}
      </SignedIn>
    </BrowserRouter>
  );
}
