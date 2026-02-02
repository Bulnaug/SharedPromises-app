import { useParams, Navigate } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { Sidebar } from "../components/Sidebar";
import { UserWishes } from "../components/UserWishes";
import { ProgressBar } from "../components/ProgressBar";
import { calcProgress } from "../utils/progress";
import { useDashboard } from "../hooks/useDashboard";

export default function Dashboard() {
  const { roomId } = useParams<{ roomId: string }>();

  const convexRoomId = roomId
    ? (roomId as Id<"rooms">)
    : null;

  const { data, toggleFulfilled } =
    useDashboard(convexRoomId);

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

  const allWishes = Object.values(wishesByUser).flat();
  const totalProgress = calcProgress(allWishes);

  return (
    <div className="flex min-h-screen">
      <Sidebar roomId={room._id} />

      <main className="flex-1 p-6 max-w-xl mx-auto space-y-6">
        <h1 className="text-xl font-bold text-center">
          {room.name}
        </h1>

        <section>
          <h2 className="text-sm font-semibold mb-1">
            Общий прогресс: {totalProgress}%
          </h2>
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
