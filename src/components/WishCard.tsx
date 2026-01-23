import { motion } from "framer-motion";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { useState } from "react";

type Wish = Doc<"wishes">;
type Role = "author" | "partner";

/* ---------- UI для статусов ---------- */

type StatusUI = {
  label: string;
  bgColor: string;
  badge: string;
  pulse?: boolean;
  glow?: boolean;
};

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

export default function WishCard({ wish, role }: { wish: Wish; role: Role }) {
  const markDone = useMutation(api.wishes.markDone);
  const confirm = useMutation(api.wishes.confirm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ui = statusUI[wish.status];

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

      {/* Содержимое карточки */}
      <div className="relative z-10 space-y-2">
        <p className="text-lg">{wish.text}</p>

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

        {/* Действия */}
        {role === "author" && wish.status === "pending" && (
          <button
            onClick={handleMarkDone}
            disabled={isDisabled}
            className="px-3 py-1 mt-2 rounded bg-black text-white disabled:opacity-50 hover:bg-gray-800 transition"
          >
            Я сделал
          </button>
        )}

        {role === "partner" && wish.status === "marked_done" && (
          <button
            onClick={handleConfirm}
            disabled={isDisabled}
            className="px-3 py-1 mt-2 rounded bg-green-600 text-white disabled:opacity-50 hover:bg-green-700 transition"
          >
            Подтвердить
          </button>
        )}
      </div>
    </motion.div>
  );
}
