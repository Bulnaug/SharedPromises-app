import { useParams, Navigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

/* ================= helpers ================= */

function calcProgress(wishes: any[]) {
  if (wishes.length === 0) return 0;
  const done = wishes.filter(w => w.fulfilled).length;
  return Math.round((done / wishes.length) * 100);
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded">
      <div
        className="h-2 bg-green-500 rounded transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

/* ================= component ================= */

export default function Dashboard() {
  const { roomId } = useParams<{ roomId: string }>();

  const convexRoomId = roomId
    ? (roomId as Id<"rooms">)
    : null;

  // ❗ хуки вызываются всегда
  const data = useQuery(
    api.wishes.getWishesByRoomGrouped,
    convexRoomId ? { roomId: convexRoomId } : "skip"
  );

  const toggleFulfilled = useMutation(
    api.wishes.toggleWishFulfilled
  );

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

  // общий прогресс
  const allWishes = Object.values(wishesByUser).flat();
  const totalProgress = calcProgress(allWishes);

  return (
    <div className="flex min-h-screen">
      {/* ================= Sidebar ================= */}
      <aside className="w-56 border-r p-4 space-y-4">
        <Link
          to={`/rooms/${room._id}/new`}
          className="block rounded px-3 py-2 bg-black text-white text-sm text-center"
        >
          + Add wish
        </Link>

        <Link
          to="/rooms"
          className="block text-sm underline text-center"
        >
          ← back to rooms
        </Link>

        <Link
          to="/profile"
          className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
        >
          👤 My profile
        </Link>
        <Link
          to={`/rooms/${room._id}/settings`}
          className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
        >
          ⚙️ Settings
        </Link>
      </aside>

      {/* ================= Content ================= */}
      <main className="flex-1 p-6 max-w-xl mx-auto space-y-6">
        {/* Room title */}
        <h1 className="text-xl font-bold text-center">
          {room.name}
        </h1>

        {/* Общий прогресс */}
        <section>
          <h2 className="text-sm font-semibold mb-1">
            Общий прогресс: {totalProgress}%
          </h2>
          <ProgressBar value={totalProgress} />
        </section>

        {/* Хотелки по пользователям */}
        {Object.entries(wishesByUser).map(
          ([userId, userWishes]) => {
            const progress = calcProgress(userWishes);

            return (
              <section
                key={userId}
                className="border rounded p-4 space-y-3"
              >
                <h2 className="text-lg font-semibold">
                  Хотелки {usersMap[userId].name}
                </h2>

                <div className="text-sm text-gray-600">
                  Прогресс: {progress}%
                </div>
                <ProgressBar value={progress} />

                {userWishes.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    Пока пусто
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {userWishes.map((wish) => (
                      <li
                        key={wish._id}
                        className="border rounded p-3 flex items-center justify-between"
                      >
                        <span
                          className={
                            wish.fulfilled
                              ? "line-through text-gray-400"
                              : ""
                          }
                        >
                          {wish.title}
                        </span>

                        {/* кнопку можно нажимать всем (MVP) */}
                        <button
                          onClick={() =>
                            toggleFulfilled({
                              wishId: wish._id,
                            })
                          }
                          className="text-xs px-2 py-1 rounded border"
                        >
                          {wish.fulfilled
                            ? "↩ вернуть"
                            : "✓ сделано"}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          }
        )}
      </main>
    </div>
  );
}
