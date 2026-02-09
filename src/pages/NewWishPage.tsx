import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Sidebar } from "../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";

/* ───────────────── types ───────────────── */

type Wish = {
  _id: Id<"wishes">;
  title: string;
  fulfilled: boolean;
};

type FeedbackType = "saved" | "added" | "deleted";

type Feedback = {
  type: FeedbackType;
  text: string;
};


const listItemVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25 },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: { duration: 0.2 },
  },
};

/* ───────────────── component ───────────────── */

export default function AddWish() {
  const { roomId } = useParams<{ roomId: string }>();

  const [feedback, setFeedback] = useState<Feedback | null>(null);

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
  const [editingId, setEditingId] = useState<Id<"wishes"> | null>(null);
  const [editValue, setEditValue] = useState("");

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
      showFeedback("added"); // 👈 ВОТ ЭТО
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWish = async (wishId: Id<"wishes">) => {
    await deleteWish({ wishId });
    showFeedback("deleted");
  };

  const startEdit = (wish: Wish) => {
    setEditingId(wish._id);
    setEditValue(wish.title);
  };

  const saveEdit = async (wish: Wish) => {
    if (!editValue.trim()) return;

    await updateWish({
      wishId: wish._id,
      title: editValue.trim(),
    });

    setEditingId(null);
    showFeedback("saved"); // 👈 ВОТ ЭТО
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const showFeedback = (type: FeedbackType) => {
    const map: Record<FeedbackType, string> = {
      saved: "Сохранено",
      added: "Желание добавлено",
      deleted: "Желание удалено",
    };

    setFeedback({ type, text: map[type] });

    setTimeout(() => {
      setFeedback(null);
    }, 1500);
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
              <AnimatePresence>
                <motion.ul
                  layout
                  className="space-y-2"
                >
                  {wishes.map((wish) => {
                    const isEditing = editingId === wish._id.toString();

                    return (
                      <motion.li
                        key={wish._id}
                        layout
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
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
                        {/* ───── title / edit ───── */}
                        <div className="flex-1">
                          <AnimatePresence mode="wait">
                            {editingId === wish._id ? (
                              <motion.input
                                key="edit"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={() => saveEdit(wish)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveEdit(wish);
                                  if (e.key === "Escape") cancelEdit();
                                }}
                                className="
                                  w-full
                                  text-sm
                                  text-gray-800
                                  bg-transparent
                                  border-none
                                  px-0
                                  py-0
                                  outline-none
                                  focus:outline-none
                                  placeholder-gray-300
                                "
                              />
                            ) : (
                              <motion.p
                                key="text"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm text-gray-800"
                              >
                                {wish.title}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* ✏️ Edit */}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => startEdit(wish)}
                            className="
                              p-1.5
                              rounded-lg
                              text-gray-400
                              hover:text-gray-700
                              hover:bg-gray-100
                              transition
                            "
                            title="Редактировать"
                          >
                            <Pencil size={14} />
                          </motion.button>

                          {/* 🗑 Delete */}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteWish(wish._id)}
                            className="
                              text-xs
                              text-red-500
                              hover:text-red-600
                              transition
                            "
                          >
                            Больше не хочу
                          </motion.button>
                        </div>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </AnimatePresence>
            )}
          </div>

        </div>
      </main>
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="
              fixed
              bottom-6
              left-1/2
              -translate-x-1/2
              bg-gray-900
              text-white
              text-xs
              px-4
              py-2
              rounded-full
              shadow-lg
              pointer-events-none
            "
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
