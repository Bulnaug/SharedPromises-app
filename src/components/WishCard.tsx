import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { useState } from "react";

type Wish = Doc<"wishes">;
type Role = "author" | "partner";
const [isSubmitting, setIsSubmitting] = useState(false);
type StatusUI = {
  label: string;
  bgColor: string;
  badge: string;
  pulse?: boolean;
  glow?: boolean;
};

/* ---------- UI CONFIG ---------- */

const statusUI: Record<Wish["status"], StatusUI> = {
  pending: {
    label: "⏳ В ожидании",
    bgColor: "#f9fafb",
    badge: "bg-gray-200 text-gray-700",
  },
  marked_done: {
    label: "👀 Проверяется",
    bgColor: "#fffbeb",
    badge: "bg-yellow-200 text-yellow-800",
    pulse: true,
  },
  confirmed: {
    label: "❤️ Подтверждено",
    bgColor: "#f0fdf4",
    badge: "bg-green-200 text-green-800",
    glow: true,
  },
};

/* ---------- COMPONENT ---------- */

export default function WishCard({
  wish,
  role,
}: {
  wish: Wish;
  role: Role;
}) {
  /* ---------- MUTATIONS WITH OPTIMISTIC UI ---------- */

  const markDone = useMutation(api.wishes.markDone).withOptimisticUpdate(
    (store, args) => {
      const wishes = store.getQuery(api.wishes.list, {});
      if (!wishes) return;

      store.setQuery(
        api.wishes.list,
        {},
        wishes.map((w) =>
          w._id === args.id ? { ...w, status: "marked_done" } : w
        )
      );
    }
  );

  const confirm = useMutation(api.wishes.confirm).withOptimisticUpdate(
    (store, args) => {
      const wishes = store.getQuery(api.wishes.list, {});
      if (!wishes) return;

      store.setQuery(
        api.wishes.list,
        {},
        wishes.map((w) =>
          w._id === args.id ? { ...w, status: "confirmed" } : w
        )
      );
    }
  );

  /* ---------- HANDLERS ---------- */

  const handleMarkDone = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await markDone({ id: wish._id });
      toast.success("Отмечено как выполненное");
    } catch {
      toast.error("Ошибка при обновлении");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await confirm({ id: wish._id });
      toast.success("Желание подтверждено ❤️");
    } catch {
      toast.error("Ошибка подтверждения");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || wish.status === "confirmed";

  const ui = statusUI[wish.status];

  /* ---------- RENDER ---------- */

  return (
    <motion.div
      layout
      animate={{ backgroundColor: ui.bgColor }}
      transition={{ duration: 0.4 }}
      className="relative p-4 rounded-xl shadow space-y-3 overflow-hidden"
    >
      {/* Pulse overlay */}
      {ui.pulse && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-yellow-200"
          animate={{ opacity: [0.12, 0.25, 0.12] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 space-y-3">
        <p className="text-lg">{wish.text}</p>

        {/* Status badge */}
        <motion.span
          key={wish.status}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            boxShadow: ui.glow
              ? "0 0 20px rgba(34,197,94,.35)"
              : "none",
          }}
          transition={{ duration: 0.3 }}
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${ui.badge}`}
        >
          {ui.label}
        </motion.span>

        {/* Actions */}
        <AnimatePresence>
          {role === "author" && wish.status === "pending" && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={isDisabled}
              onClick={handleMarkDone}
              className="px-3 py-1 rounded bg-black text-white disabled:opacity-50"
            >
              Я сделал
            </motion.button>
          )}

          {role === "partner" && wish.status === "marked_done" && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={isDisabled}
              onClick={handleConfirm}
              className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
            >
              Подтвердить
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
