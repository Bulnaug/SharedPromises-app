import { ProgressBar } from "./ProgressBar";
import { calcProgress } from "../utils/progress";
import { isDoneToday } from "../utils/isDoneToday";
import { calculateWishStreak } from "../utils/calculateWishStreak";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import dayjs from "dayjs";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { Check, X} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Wish = {
  _id: Id<"wishes">;
  title: string;
  completedDates: string[];
};

type UserWishesProps = {
  name: string;
  wishes: Wish[];
  userId: Id<"users">; // текущий залогиненный пользователь
};

export function UserWishes({ name, wishes: initialWishes }: UserWishesProps) {
  const [wishes, setWishes] = useState(initialWishes);

  const progress = calcProgress(wishes);
  const today = dayjs().format("YYYY-MM-DD");

  // ✅ используем существующую мутацию toggleWishFulfilled
  const toggleWishFulfilled = useMutation(api.wishes.toggleWishFulfilled);

  const handleToggle = async (wish: Wish) => {
    const doneToday = isDoneToday(wish.completedDates);

    setWishes((prev) =>
      prev.map((w) =>
        w._id === wish._id
          ? {
              ...w,
              completedDates: doneToday
                ? w.completedDates.filter((d) => d !== today)
                : [...w.completedDates, today],
            }
          : w
      )
    );

    await toggleWishFulfilled({ wishId: wish._id });
  };


  return (
    <section className="
      bg-white
      rounded-2xl
      shadow-sm
      border border-gray-100
      p-6
      space-y-5
    ">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Что получает {name}
        </h2>
        <span className="text-sm font-medium text-gray-500">
          {progress}%
        </span>
      </div>

      <ProgressBar value={progress} />

      {wishes.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Пока здесь пусто ✨</p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence>
            {wishes.map((wish) => {
              const doneToday = isDoneToday(wish.completedDates);
              const streak = calculateWishStreak(wish);

              return (
                <motion.li
                  key={wish._id.toString()}
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
                  <span className={doneToday
                    ? "line-through text-gray-400"
                    : "text-gray-800"}
                  >
                    {wish.title}
                  </span>

                  {streak > 0 && (
                    <span className="text-xs text-orange-500 font-medium">
                      🔥 {streak}
                    </span>
                  )}
                </div>

                <motion.button
                  layout
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToggle(wish)}
                  className={`
                    inline-flex items-center gap-2
                    text-xs px-3 py-1.5
                    rounded-full font-medium
                    ${
                      doneToday
                        ? "bg-green-100 text-green-700 hover:bg-red-200"
                        : "bg-gray-100 text-gray-700 hover:bg-green-200"
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
          })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
