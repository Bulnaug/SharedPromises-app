import { ProgressBar } from "./ProgressBar";
import { calcProgress } from "../utils/progress";
import { isDoneToday } from "../utils/isDoneToday";
import { calculateWishStreak } from "../utils/calculateWishStreak";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import dayjs from "dayjs";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

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

    // Оптимистично обновляем локальный стейт
    setWishes((prev) =>
      prev.map((w) => {
        if (w._id === wish._id) {
          return {
            ...w,
            completedDates: doneToday
              ? w.completedDates.filter((d) => d !== today)
              : [...w.completedDates, today],
          };
        }
        return w;
      })
    );

    // Отправляем мутацию в базу
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
          {wishes.map((wish) => {
            const doneToday = isDoneToday(wish.completedDates);
            const streak = calculateWishStreak(wish);

            return (
              <li
                key={wish._id.toString()}
                className="
                flex items-center justify-between
                px-4 py-3
                rounded-xl
                border border-gray-100
                hover:bg-gray-50
                transition"
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

                <button
                  onClick={() => handleToggle(wish)}
                  className={`
                    text-xs
                    px-3 py-1.5
                    rounded-full
                    font-medium
                    transition
                    ${
                      doneToday
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {doneToday ? "↩ не сделано" : "✓ сделано"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
