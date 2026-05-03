import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import JoinRoom from "./components/JoinRoom";
import ProfilePage from "./pages/ProfilPage";
import RoomSettingsRoute from "./pages/RoomSettingsRoute";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useRef } from "react";


// Pages
import AIAgentsPage from "./features/ai-agents/AIAgentsPage";
import Landing from "./pages/Landing";
import RoomsPage from "./pages/RoomsPage";
import Dashboard from "./pages/Dashboard";
import AddWishPage from "./pages/AddWishPage";
import TasksPage from "./components/tasks/components/TasksPage";
import NewTaskPage from "./components/tasks/components/NewTaskPage";
import TasksCalendarPage from "./components/tasks/components/TasksCalendarPage";

// ✅ Layout
import { AppLayout } from "./layouts/AppLayout";
import { TasksLayout } from "./components/tasks/components/TasksLayout";

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
    <>
      <BrowserRouter>
        <SignedOut>
          <Routes>
            <Route path="*" element={<Landing />} />
          </Routes>
        </SignedOut>

        <SignedIn>
          {me === undefined && <div>Loading...</div>}

          {me && (
            <Routes>
              <Route path="/" element={<Navigate to="/rooms" />} />
              <Route path="/join/:inviteCode" element={<JoinRoom />} />
              <Route path="/rooms" element={<RoomsPage />} />

              <Route element={<AppLayout />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/rooms/:roomId" element={<Dashboard />} />
                <Route path="/rooms/:roomId/new" element={<AddWishPage />} />
                <Route path="/rooms/:roomId/settings" element={<RoomSettingsRoute />} />
                <Route path="/ai-agents" element={<AIAgentsPage />} />
              </Route>
              <Route element={<TasksLayout />}>
                <Route path="tasks" element={<TasksPage />} />
                <Route path="tasks/new" element={<NewTaskPage />} />
                <Route path="/tasks/calendar" element={<TasksCalendarPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/rooms" />} />
            </Routes>
          )}
        </SignedIn>
      </BrowserRouter>
    </>
  );
}