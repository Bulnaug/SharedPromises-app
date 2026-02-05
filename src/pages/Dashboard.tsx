import { useParams, Navigate } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { Sidebar } from "../components/Sidebar";
import { UserWishes } from "../components/UserWishes";
import { ProgressBar } from "../components/ProgressBar";
import { calcProgress } from "../utils/progress";
import { useDashboard } from "../hooks/useDashboard";

import { build30DaysActivity } from "../utils/activity";
import { Activity30Days } from "../components/Activity30Days";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Dashboard() {
  const { roomId } = useParams<{ roomId: string }>();

  const convexRoomId = roomId
    ? (roomId as Id<"rooms">)
    : null;

  // ✅ ХУКИ — ВСЕГДА ПЕРВЫМИ
  const { data, toggleFulfilled, toggleDay } =
    useDashboard(convexRoomId);

  // ❗ после хуков — любые return
  if (!convexRoomId) {
    return <Navigate to="/rooms" replace />;
  }

  if (data === undefined) {
    return <div className="p-6">Loading…</div>;
  }

  if (!data) {
    return <div className="p-6">Room not found</div>;
  }

  // ✅ дальше — обычный JS
  const { room, wishesByUser, usersMap } = data;

  const allWishes = Object.values(wishesByUser).flat();
  const totalProgress = calcProgress(allWishes);
  const activity30Days = build30DaysActivity(allWishes);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar roomId={room._id} />

      <main className="flex-1 p-6 max-w-xl mx-auto space-y-6">
        <h1 className="
          text-2xl
          font-semibold
          text-center
          bg-white
          rounded-2xl
          py-4
          shadow-sm
        ">
          {room.name}
        </h1>

        <section className="
          bg-white
          rounded-2xl
          p-4
          shadow-sm
          space-y-2
        ">
          <Activity30Days data={activity30Days} />
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-700">
              Общий прогресс
            </h2>
            <span className="text-sm font-semibold">
              {totalProgress}%
            </span>
          </div>
          <ProgressBar value={totalProgress} />
        </section>

        {Object.entries(wishesByUser).map(
          ([userId, wishes]) => (
            <UserWishes
              key={userId}
              name={usersMap[userId].name}
              wishes={wishes}
              onToggle={(id) =>
                toggleFulfilled({ wishId: id })
              }
            />
          )
        )}
      </main>
    </div>
  );
}
