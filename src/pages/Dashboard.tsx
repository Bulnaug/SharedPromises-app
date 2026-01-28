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

  const wishes = useQuery(
    api.wishes.getWishesByRoom,
    convexRoomId ? { roomId: convexRoomId } : "skip"
  );

  const toggleWish = useMutation(api.wishes.toggleWishFulfilled);

  if (!convexRoomId) {
    return <Navigate to="/rooms" replace />;
  }

  if (room === undefined || wishes === undefined) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 border-r p-4">
        <h2 className="font-semibold mb-4">
          {room.name}
        </h2>

        <Link
          to={`/rooms/${room._id}/new`}
          className="block rounded px-3 py-2 bg-black text-white text-sm"
        >
          + Add wish
        </Link>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 max-w-xl">
        <h1 className="text-xl font-bold mb-4">
          Wishes
        </h1>

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
      </main>
    </div>
  );
}
