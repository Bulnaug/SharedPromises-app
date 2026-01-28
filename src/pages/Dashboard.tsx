import { useParams, Navigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

export default function Dashboard() {
  const { roomId } = useParams<{ roomId: string }>();

  // Приводим URL → Convex Id
  const convexRoomId = roomId
    ? (roomId as Id<"rooms">)
    : null;

  const room = useQuery(
    api.rooms.getRoom,
    convexRoomId ? { roomId: convexRoomId } : "skip"
  );

  const wishes = useQuery(
    api.wishes.getWishesByRoom,
    convexRoomId ? { roomId: convexRoomId } : "skip"
  );

  const createWish = useMutation(api.wishes.createWish);
  const toggleWish = useMutation(api.wishes.toggleWishFulfilled);

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Некорректный URL
  if (!convexRoomId) {
    return <Navigate to="/rooms" replace />;
  }

  // Загрузка
  if (room === undefined || wishes === undefined) {
    return <div className="p-6">Loading room…</div>;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      await createWish({
        roomId: convexRoomId,
        title,
      });
      setTitle("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{room.name}</h1>
        <p className="text-sm text-gray-500">
          Room dashboard
        </p>
      </div>

      {/* Create wish */}
      <form onSubmit={submit} className="flex gap-2 mb-6">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="New wish…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          Add
        </button>
      </form>

      {/* Wishes */}
      {wishes.length === 0 ? (
        <p className="text-gray-500">
          No wishes yet ✨
        </p>
      ) : (
        <ul className="space-y-2">
          {wishes.map((wish) => (
            <li
              key={wish._id}
              className="border rounded p-3 flex items-center gap-3"
            >
              <input
                type="checkbox"
                checked={wish.fulfilled}
                onChange={() =>
                  toggleWish({ wishId: wish._id })
                }
              />
              <span
                className={
                  wish.fulfilled
                    ? "line-through text-gray-400"
                    : ""
                }
              >
                {wish.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
