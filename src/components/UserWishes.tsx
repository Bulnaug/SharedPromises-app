import { ProgressBar } from "./ProgressBar";
import { calcProgress } from "../utils/progress";
import { isDoneToday } from "../utils/isDoneToday";

export function UserWishes({
  name,
  wishes,
  onToggle,
}: {
  name: string;
  wishes: any[];
  onToggle: (wishId: any) => void;
}) {
  const progress = calcProgress(wishes);

  return (
    <section className="
      bg-white
      rounded-2xl
      p-5
      shadow-sm
      space-y-4
    ">
      <h2 className="text-lg font-semibold text-gray-900">
        Хотелки {name}
      </h2>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Прогресс</span>
        <span className="font-medium">{progress}%</span>
      </div>

      <ProgressBar value={progress} />

      {wishes.length === 0 ? (
        <p className="text-sm text-gray-400 italic">
          Пока здесь пусто ✨
        </p>
      ) : (
        <ul className="space-y-2">
          {wishes.map(wish => {
            const doneToday = isDoneToday(
              wish.completedDates
            );

            return (
              <li
                key={wish._id}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  py-3
                  flex
                  items-center
                  justify-between
                  hover:bg-gray-50
                  transition
                "
              >
                <span
                  className={
                    doneToday
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }
                >
                  {wish.title}
                </span>

                <button
                  onClick={() => onToggle(wish._id)}
                  className={`
                    text-xs
                    px-3
                    py-1.5
                    rounded-full
                    border
                    font-medium
                    transition
                    ${
                      doneToday
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  {doneToday
                    ? "↩ вернуть"
                    : "✓ сделано"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
