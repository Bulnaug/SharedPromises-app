import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export default function AddWish() {
  const { roomId } = useParams<{ roomId: string }>();

  const convexRoomId = roomId
    ? (roomId as Id<"rooms">)
    : null;

  if (!convexRoomId) {
    return <Navigate to="/rooms" replace />;
  }

  const wishes = useQuery(
    api.wishes.getMyWishesByRoom,
    { roomId: convexRoomId }
  );

  const createWish = useMutation(api.wishes.createWish);
  const deleteWish = useMutation(api.wishes.deleteWish);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  if (wishes === undefined) {
    return <div className="p-6">Loading…</div>;
  }

  const handleAddWish = async () => {
    if (!title.trim()) return;

    setLoading(true);
    try {
      await createWish({
        roomId: convexRoomId,
        title: title.trim(),
        description: description.trim() || undefined,
      });
      setTitle("");
      setDescription("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">
          Добавить хотелку
        </h1>

        <Link
          to={`/rooms/${convexRoomId}`}
          className="text-sm underline"
        >
          ← назад
        </Link>
      </div>

      {/* Add wish form */}
      <div className="space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Я хочу..."
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание (необязательно)"
          className="w-full border rounded px-3 py-2 text-sm"
          rows={3}
        />

        <button
          onClick={handleAddWish}
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white text-sm disabled:opacity-50"
        >
          Добавить
        </button>
      </div>

      {/* Wishes list */}
      <div className="space-y-3">
        <h2 className="font-semibold text-sm text-gray-600">
          Желания в этой комнате
        </h2>

        {wishes.length === 0 ? (
          <p className="text-sm text-gray-400">
            Пока желаний нет
          </p>
        ) : (
          <ul className="space-y-2">
            {wishes.map((wish) => (
              <li
                key={wish._id}
                className="border rounded p-3 flex items-center justify-between gap-3"
              >
                <div>
                  <div
                    className={
                      wish.fulfilled
                        ? "line-through text-gray-400"
                        : ""
                    }
                  >
                    {wish.title}
                  </div>
                </div>

                {/* Удаление (если нельзя — mutation сама запретит) */}
                <button
                  onClick={() =>
                    deleteWish({ wishId: wish._id })
                  }
                  className="text-xs text-red-500"
                >
                  удалить
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
