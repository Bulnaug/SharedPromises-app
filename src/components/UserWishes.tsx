import { ProgressBar } from "./ProgressBar";
import { calcProgress } from "../utils/progress";

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
    <section className="border rounded p-4 space-y-3">
      <h2 className="text-lg font-semibold">
        Хотелки {name}
      </h2>

      <div className="text-sm text-gray-600">
        Прогресс: {progress}%
      </div>
      <ProgressBar value={progress} />

      {wishes.length === 0 ? (
        <p className="text-sm text-gray-400">Пока пусто</p>
      ) : (
        <ul className="space-y-2">
          {wishes.map(wish => (
            <li
              key={wish._id}
              className="border rounded p-3 flex items-center justify-between"
            >
              <span
                className={
                  wish.fulfilled
                    ? "line-through text-gray-400"
                    : ""
                }
              >
                {wish.title}
              </span>

              <button
                onClick={() => onToggle(wish._id)}
                className="text-xs px-2 py-1 rounded border"
              >
                {wish.fulfilled ? "↩ вернуть" : "✓ сделано"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
