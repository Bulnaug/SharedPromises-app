import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Sidebar } from "../components/Sidebar";

export default function RoomSettings() {
  const { roomId } = useParams<{ roomId: string }>();

  const convexRoomId = roomId
    ? (roomId as Id<"rooms">)
    : null;

  const room = useQuery(
    api.rooms.getRoom,
    convexRoomId ? { roomId: convexRoomId } : "skip"
  );

  if (!convexRoomId) {
    return <Navigate to="/rooms" replace />;
  }

  if (room === undefined) {
    return <div className="p-6">Loading…</div>;
  }

  if (!room) {
    return <div className="p-6">Room not found</div>;
  }

  const inviteLink = `${window.location.origin}/join/${room._id}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar roomId={convexRoomId} />
      <main className="flex-1 px-6 py-8">
        <div className="max-w-xl mx-auto space-y-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Параметры комнаты
          </h1>

          {/* Invite */}
          <section className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <h2 className="font-medium">
              Приглашение
            </h2>

            <p className="text-sm text-gray-600">
              Отправь ссылку для приглашения
            </p>

            <input
              readOnly
              value={inviteLink}
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-2
                text-sm
                bg-gray-50
              "
            />
          </section>

          {/* Members */}
          <section className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
            <h2 className="font-medium">
              Участники
            </h2>

            <ul className="text-sm space-y-1 text-gray-700">
              {room.users.map((user) =>
                user ? (
                  <li key={user._id}>
                    • {user.name}
                  </li>
                ) : null
              )}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
