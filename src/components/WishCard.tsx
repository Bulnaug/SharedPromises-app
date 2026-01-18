import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

type Wish = Doc<"wishes">;
type Role = "author" | "partner";

const statusMap: Record<Wish["status"], string> = {
  pending: "⏳ В ожидании",
  marked_done: "👀 Проверяется",
  confirmed: "❤️ Подтверждено",
};

const statusColor: Record<Wish["status"], string> = {
  pending: "text-gray-500",
  marked_done: "text-yellow-600",
  confirmed: "text-green-600",
};

export default function WishCard({
  wish,
  role,
}: {
  wish: Wish;
  role: Role;
}) {
  const markDone = useMutation(api.wishes.markDone);
  const confirm = useMutation(api.wishes.confirm);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="p-4 bg-white rounded-xl shadow space-y-2"
    >
      <p className="text-lg">{wish.text}</p>

      {/* STATUS */}
      <motion.p
        key={wish.status}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`text-sm font-medium ${statusColor[wish.status]}`}
      >
        {statusMap[wish.status]}
      </motion.p>

      {/* ACTIONS */}
      <AnimatePresence>
        {role === "author" && wish.status === "pending" && (
          <motion.button
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => markDone({ id: wish._id })}
            className="px-3 py-1 rounded bg-black text-white"
          >
            Я сделал
          </motion.button>
        )}

        {role === "partner" && wish.status === "marked_done" && (
          <motion.button
            key="confirm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => confirm({ id: wish._id })}
            className="px-3 py-1 rounded bg-green-600 text-white"
          >
            Подтвердить
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
