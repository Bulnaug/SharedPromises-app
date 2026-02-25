import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { isDoneToday } from "../utils/isDoneToday";
import { calculateWishStreak } from "../utils/calculateWishStreak";
import { useTranslation } from "react-i18next";

import type { Wish } from "../types";

type Props = {
  wish: Wish;
  onToggle: (wish: Wish) => void;
};

export function WishItem({ wish, onToggle }: Props) {
  const doneToday = isDoneToday(wish.completedDates);
  const streak = calculateWishStreak(wish);

  const { t } = useTranslation();

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="
        flex items-center justify-between
        px-4 py-3
        rounded-xl
        border border-gray-100
        hover:bg-gray-50
      "
    >
      <div className="flex items-center gap-3">
        <motion.span
          layout
          animate={{
            opacity: doneToday ? 0.5 : 1,
          }}
          transition={{ duration: 0.2 }}
          className={doneToday ? "line-through" : ""}
        >
            {wish.title}
        </motion.span>

        {streak > 0 && (
          <span className="text-xs text-orange-500 font-medium">
            🔥 {streak}
          </span>
        )}
      </div>

      <motion.button
        layout
        whileTap={{ scale: 0.95 }}
        onClick={() => onToggle(wish)}
        title={doneToday ? t("cancel") : t("done")}
        className={`
            inline-flex items-center justify-center
            w-9 h-9
            rounded-full
            transition
            ${
            doneToday
                ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
                : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
            }
        `}
      >
        <AnimatePresence mode="wait">
          {doneToday ? (
            <motion.span
              key="undo"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 180, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <X size={14} />
            </motion.span>
          ) : (
            <motion.span
              key="check"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Check size={14} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.li>
  );
}
