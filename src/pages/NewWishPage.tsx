import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Sidebar } from "../components/Sidebar";

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
    return <div className="p-6 text-sm text-gray-500">Loading…</div>;
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar roomId={convexRoomId} />

      {/* Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Новое желание
            </h1>
            <p className="text-sm text-gray-500">
              Напиши что хочешь получать каждый день 💚
            </p>
          </div>

          {/* Add wish card */}
          <div
            className="
              bg-white
              rounded-2xl
              border border-gray-100
              shadow-sm
              p-6
              space-y-4
            "
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Я хочу
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Пожелания спокойной ночи"
                className="
                  w-full
                  rounded-xl
                  border border-gray-200
                  px-4 py-2.5
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500
                  focus:border-transparent
                "
                autoFocus
              />
            </div>

            <button
              onClick={handleAddWish}
              disabled={loading || !title.trim()}
              className="
                w-full
                bg-green-500
                text-white
                rounded-xl
                py-2.5
                text-sm
                font-medium
                hover:bg-green-600
                disabled:opacity-50
                transition
              "
            >
              Добавить
            </button>
          </div>

          {/* Wishes list */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-600">
              То что ты уже хочешь :
            </h2>

            {wishes.length === 0 ? (
              <p className="text-sm text-gray-400">
                No wishes yet
              </p>
            ) : (
              <ul className="space-y-2">
                {wishes.map((wish) => (
                  <li
                    key={wish._id}
                    className="
                      bg-white
                      border border-gray-100
                      rounded-xl
                      p-4
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >
                    <div className="flex-1">
                      <div
                        className={
                          wish.fulfilled
                            ? "text-sm line-through text-gray-400"
                            : "text-sm text-gray-800"
                        }
                      >
                        {wish.title}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        deleteWish({ wishId: wish._id })
                      }
                      className="
                        text-xs
                        text-red-500
                        hover:text-red-600
                        transition
                      "
                    >
                      Больше не хочу
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
