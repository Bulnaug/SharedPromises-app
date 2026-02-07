import { useParams, Navigate } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { Sidebar } from "../components/Sidebar";
import { UserWishes } from "../components/UserWishes";
import { ProgressBar } from "../components/ProgressBar";
import { calcProgress } from "../utils/progress";
import { useDashboard } from "../hooks/useDashboard";
import { build30DaysActivity } from "../utils/activity";
import { Tracker } from "../components/tracker/Tracker";
import dayjs from "dayjs";

export default function Dashboard() {
  const { roomId } = useParams<{ roomId: string }>();

  const startDate = dayjs().startOf("month").format("YYYY-MM-DD");

  const convexRoomId = roomId ? (roomId as Id<"rooms">) : null;

  // ✅ Хуки — ВСЕГДА ПЕРВЫМИ
  const { data } = useDashboard(convexRoomId);

  if (!convexRoomId) {
    return <Navigate to="/rooms" replace />;
  }

  if (data === undefined) {
    return <div className="p-6">Loading…</div>;
  }

  if (!data) {
    return <div className="p-6">Room not found</div>;
  }

  const { room, wishesByUser, usersMap } = data;

  // Все желания всех пользователей
  const allWishes = Object.values(wishesByUser).flat();

  const totalProgress = calcProgress(allWishes);

  // 30-дневная активность для трекера
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

        {/* === 30-дневный трекер === */}
        <section className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <Tracker wishes={allWishes} startDate={startDate} />

          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-700">Общий прогресс</h2>
            <span className="text-sm font-semibold">{totalProgress}%</span>
          </div>

          <ProgressBar value={totalProgress} />
        </section>

        {/* === Список желаний пользователей === */}
        {Object.entries(wishesByUser).map(([userId, wishes]) => {
          const user = usersMap[userId];
          if (!user) return null;

          return (
            <UserWishes
              key={userId}
              name={user.name || "Без имени"}
              wishes={wishes}
              userId={userId as Id<"users">} // Приведение строки к Id<"users">
            />
          );
        })}
      </main>
    </div>
  );
}
