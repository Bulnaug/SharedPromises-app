import { ProgressBar } from "./ProgressBar";
import { calcProgress } from "../utils/progress";
import { isDoneToday } from "../utils/isDoneToday";
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
  userId: Id<"users">;
};

export function UserWishes({ name, wishes: initialWishes, userId }: UserWishesProps) {
  const [wishes, setWishes] = useState(initialWishes);

  const progress = calcProgress(wishes);

  const markComplete = useMutation(api.wishProgress.markComplete);
  const unmarkComplete = useMutation(api.wishProgress.unmarkComplete);

  const today = dayjs().format("YYYY-MM-DD");

  const handleToggle = async (wish: Wish) => {
    const doneToday = isDoneToday(wish.completedDates);
    const wishId = wish._id;

    // Оптимистично обновляем UI
    setWishes((prev) =>
      prev.map((w) => {
        if (w._id === wishId) {
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

    // Вызываем мутацию
    if (doneToday) {
      await unmarkComplete({ wishId, date: today, userId });
    } else {
      await markComplete({ wishId, date: today, userId });
    }
  };

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Хотелки {name}</h2>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Прогресс</span>
        <span className="font-medium">{progress}%</span>
      </div>

      <ProgressBar value={progress} />

      {wishes.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Пока здесь пусто ✨</p>
      ) : (
        <ul className="space-y-2">
          {wishes.map((wish) => {
            const doneToday = isDoneToday(wish.completedDates);

            return (
              <li
                key={wish._id.toString()}
                className="rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className={doneToday ? "line-through text-gray-400" : "text-gray-800"}>
                  {wish.title}
                </span>

                <button
                  onClick={() => handleToggle(wish)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                    doneToday ? "bg-green-100 text-green-700 border-green-200" : "hover:bg-gray-100"
                  }`}
                >
                  {doneToday ? "↩ вернуть" : "✓ сделано"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
