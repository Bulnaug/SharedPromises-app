import type { DayActivity } from "../utils/activity";

export function Activity30Days({
  data,
}: {
  data: DayActivity[];
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xs text-gray-500">
        Активность за 30 дней
      </div>

      <div className="grid grid-cols-10 gap-1">
        {data.map((day) => (
          <div
            key={day.date}
            title={day.date}
            className={`
              w-5 h-5 rounded
              ${
                day.status === "empty" &&
                "bg-gray-200"
              }
              ${
                day.status === "partial" &&
                "bg-green-300"
              }
              ${
                day.status === "full" &&
                "bg-green-600"
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}
