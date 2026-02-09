import { useParams, Navigate } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { Sidebar } from "../components/Sidebar";
import { UserWishes } from "../components/UserWishes";
import { ProgressBar } from "../components/ProgressBar";
import { calcProgress } from "../features/wishes/utils/progress";
import { useDashboard } from "../hooks/useDashboard";
import { Tracker } from "../features/tracker/components/Tracker";
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar roomId={room._id} />

      <main className="
        flex-1
        px-6
        py-8
        max-w-4xl
        mx-auto
        space-y-8
      ">
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
        <section className="
          bg-white
          rounded-2xl
          shadow-sm
          border border-gray-100
          p-6
          space-y-5
        ">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-500">
              Активность за 30 дней
            </h2>
            <span className="text-xs text-gray-400">
              последние дни
            </span>
          </div>

          {/* Трекер */}
          <div className="flex justify-center">
            <Tracker wishes={allWishes} startDate={startDate} />
          </div>

          {/* Общий прогресс */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Общий прогресс сегодня</span>
              <span className="font-semibold text-gray-900">
                {totalProgress}%
              </span>
            </div>

            <ProgressBar value={totalProgress} />
          </div>
        </section>
        <section className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        ">
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
        </section>
      </main>
    </div>
  );
}
