import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export default function Dashboard() {
  const { roomId } = useParams<{ roomId: string }>();

  const convexRoomId = roomId
    ? (roomId as Id<"rooms">)
    : null;

  const room = useQuery(
    api.rooms.getRoom,
    convexRoomId ? { roomId: convexRoomId } : "skip"
  );

  const data = useQuery(
    api.wishes.getWishesByRoomGrouped,
    roomId ? { roomId: roomId as Id<"rooms"> } : "skip"
  );

  if (!data) return <div>Loading…</div>;


  const toggleWish = useMutation(api.wishes.toggleWishFulfilled);

  if (!convexRoomId) {
    return <Navigate to="/rooms" replace />;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-center">
        {data.room.name}
      </h1>

      {data.members.map((userId) => {
        const wishes = data.wishesByUser[userId] ?? [];
        const isMe = userId === data.meId;

        return (
          <section key={userId}>
            <h2 className="text-lg font-semibold mb-2">
              {isMe ? "Мои хотелки" : "Хотелки партнёра"}
            </h2>

            {wishes.length === 0 ? (
              <p className="text-gray-400 text-sm">
                Пока пусто
              </p>
            ) : (
              <ul className="space-y-2">
                {wishes.map(wish => (
                  <li
                    key={wish._id}
                    className="border rounded p-3 flex gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={wish.fulfilled}
                      readOnly
                    />
                    <span>{wish.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
