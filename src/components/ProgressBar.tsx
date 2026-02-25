export function ProgressBar({ value }: { value: number }) {
  const color =
    value === 100
      ? "bg-emerald-500 dark:bg-emerald-400"
      : value >= 50
      ? "bg-emerald-400 dark:bg-emerald-400"
      : value > 0
      ? "bg-amber-400 dark:bg-amber-400"
      : "bg-slate-300 dark:bg-slate-600";

  return (
    <div
      className="
        w-full h-2.5 rounded-full overflow-hidden
        bg-gray-200
        dark:bg-slate-700/60
      "
    >
      <div
        className={`
          h-full transition-all duration-500
          ${color}
        `}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}