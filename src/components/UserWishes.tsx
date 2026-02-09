import { ProgressBar } from "./ProgressBar";
import { calcProgress } from "../utils/progress";
import { isDoneToday } from "../utils/isDoneToday";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import dayjs from "dayjs";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WishItem } from "../features/wishes/components/WishItem";

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
              return (
                <WishItem
                  key={wish._id.toString()}
                  wish={wish}
                  onToggle={handleToggle}
                />
            );
          })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
