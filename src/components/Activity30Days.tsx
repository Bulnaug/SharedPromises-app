import type { ActivityLevel } from "../utils/activity";

function color(level: ActivityLevel) {
  switch (level) {
    case 0:
      return "bg-slate-700";
    case 1:
      return "bg-green-500";
    case 2:
      return "bg-green-700";
  }
}

export function Activity30Days({
  data,
}: {
  data: ActivityLevel[];
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold text-center text-slate-300">
        Активность за 30 дней
      </h3>

      <div className="grid grid-rows-3 grid-flow-col gap-1 justify-center">
        {data.map((lvl, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded ${color(lvl)}`}
            title={`День ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex justify-center gap-2 text-xs text-slate-400">
        <span>мало</span>
        <span>●</span>
        <span>средне</span>
        <span>●</span>
        <span>много</span>
      </div>
    </section>
  );
}
