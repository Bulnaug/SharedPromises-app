import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Sidebar } from "../components/Sidebar";

/* ───────────────── types ───────────────── */

type Wish = {
  _id: Id<"wishes">;
  title: string;
  fulfilled: boolean;
};

/* ───────────────── component ───────────────── */

export default function AddWish() {
  const { roomId } = useParams<{ roomId: string }>();

  const convexRoomId = roomId
    ? (roomId as Id<"rooms">)
    : null;

  if (!convexRoomId) {
    return <Navigate to="/rooms" replace />;
  }

  /* ─────────────── data ─────────────── */

  const wishesQuery = useQuery(
    api.wishes.getMyWishesByRoom,
    { roomId: convexRoomId }
  );

  const createWish = useMutation(api.wishes.createWish);
  const deleteWish = useMutation(api.wishes.deleteWish);
  const updateWish = useMutation(api.wishes.updateWish);

  /* ─────────────── local state ─────────────── */

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // inline edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  /* ─────────────── sync query → state ─────────────── */

  useEffect(() => {
    if (wishesQuery) {
      setWishes(wishesQuery);
    }
  }, [wishesQuery]);

  if (wishesQuery === undefined) {
    return <div className="p-6 text-sm text-gray-500">Loading…</div>;
  }

  /* ─────────────── actions ─────────────── */

  const handleAddWish = async () => {
    if (!title.trim()) return;

    setLoading(true);
    try {
      await createWish({
        roomId: convexRoomId,
        title: title.trim(),
      });
      setTitle("");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (wish: Wish) => {
    setEditingId(wish._id.toString());
    setDraftTitle(wish.title);
  };

  const saveEdit = async (wish: Wish) => {
    const newTitle = draftTitle.trim();
    if (!newTitle || newTitle === wish.title) {
      setEditingId(null);
      return;
    }

    // optimistic update
    setWishes((prev) =>
      prev.map((w) =>
        w._id === wish._id ? { ...w, title: newTitle } : w
      )
    );

    setEditingId(null);
    await updateWish({ wishId: wish._id, title: newTitle });
  };

  /* ─────────────── UI ─────────────── */

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

          {/* Add wish */}
          <div className="
            bg-white
            rounded-2xl
            border border-gray-100
            shadow-sm
            p-6
            space-y-4
          ">
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
              "
              autoFocus
            />

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
              То, что ты уже хочешь
            </h2>

            {wishes.length === 0 ? (
              <p className="text-sm text-gray-400">
                Пока желаний нет ✨
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
                      {editingId === wish._id.toString() ? (
                        <input
                          autoFocus
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          onBlur={() => saveEdit(wish)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(wish);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="
                            w-full
                            text-sm
                            px-2 py-1
                            rounded-lg
                            border border-gray-300
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-500
                          "
                        />
                      ) : (
                        <div
                          onClick={() => startEdit(wish)}
                          className={`
                            text-sm
                            cursor-text
                            ${
                              wish.fulfilled
                                ? "line-through text-gray-400"
                                : "text-gray-800 hover:underline"
                            }
                          `}
                        >
                          {wish.title}
                        </div>
                      )}
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
