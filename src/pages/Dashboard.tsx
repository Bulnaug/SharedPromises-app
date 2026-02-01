import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import ProfilePage from "./ProfilPage";

export default function Dashboard() {
  const { roomId } = useParams<{ roomId: string }>();

  const convexRoomId = roomId
    ? (roomId as Id<"rooms">)
    : null;

  // ✅ ХУКИ ВСЕГДА СВЕРХУ
  const room = useQuery(
    api.rooms.getRoom,
    convexRoomId ? { roomId: convexRoomId } : "skip"
  );

  const wishes = useQuery(
    api.wishes.getWishesByRoom,
    convexRoomId ? { roomId: convexRoomId } : "skip"
  );

  const wishesByUser = React.useMemo(() => {
    if (!wishes) return {};

    const grouped: Record<string, typeof wishes> = {};

    for (const wish of wishes) {
      if (!wish.userId) continue;

      const key = wish.userId.toString();
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(wish);
    }

    return grouped;
  }, [wishes]);

  // ⬇️⬇️⬇️ RETURN ТОЛЬКО ПОСЛЕ ВСЕХ ХУКОВ ⬇️⬇️⬇️

  if (!convexRoomId) {
    return <Navigate to="/rooms" replace />;
  }

  if (room === undefined || wishes === undefined) {
    return <div className="p-6">Loading…</div>;
  }

  if (!room) {
    return <div className="p-6">Room not found</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 border-r p-4">
        <Link
          to={`/rooms/${room._id}/new`}
          className="block rounded px-3 py-2 bg-black text-white text-sm text-center"
        >
          + Add wish
        </Link>

        <Link
          to={`/rooms/`}
          className="block rounded px-3 py-2 bg-black text-white text-sm text-center"
        >
          My rooms
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

      {/* Content */}
      <main className="flex-1 p-6">
        <h1 className="text-xl font-bold text-center mb-8">
          {room.name}
        </h1>

        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
          {room.users.map((user) => {
            const userWishes =
              wishesByUser[user!._id.toString()] ?? [];

            return (
              <section
                key={user!._id}
                className="border rounded p-4"
              >
                <h2 className="text-lg font-semibold mb-3 text-center">
                  Хотелки {user!.name ?? "пользователя"}
                </h2>

                {userWishes.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center">
                    Пока пусто
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {userWishes.map((wish) => (
                      <li
                        key={wish._id}
                        className="border rounded p-3"
                      >
                        {wish.title}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
