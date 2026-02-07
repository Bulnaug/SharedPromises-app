import dayjs from "dayjs";
import type { Id } from "../../convex/_generated/dataModel";

type Activity30DaysProps = {
  wishes: {
    _id: Id<"wishes">;
    completedDates: string[];
  }[];
};

export function Activity30Days({ wishes }: Activity30DaysProps) {
  const today = dayjs();
  const days = Array.from({ length: 30 }, (_, i) =>
    today.subtract(29 - i, "day").format("YYYY-MM-DD")
  );

  // Считаем процент выполненных желаний за каждый день
  const dayStatus = days.map((date) => {
    const total = wishes.length;
    const done = wishes.filter((w) => w.completedDates.includes(date)).length;
    const percent = total > 0 ? (done / total) * 100 : 0;
    return { date, percent };
  });

  return (
    <div className="grid grid-cols-30 gap-1">
      {dayStatus.map((d, i) => {
        let color = "bg-gray-300"; // 0%
        if (d.percent === 100) color = "bg-green-500";
        else if (d.percent > 0) color = "bg-yellow-400"; // частично выполнено

        return (
          <div
            key={i}
            title={`${d.date} — выполнено ${Math.round(d.percent)}%`}
            className={`w-3 h-3 rounded-full ${color} transition`}
          ></div>
        );
      })}
    </div>
  );
}
