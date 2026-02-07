export function ProgressBar({ value }: { value: number }) {
  const color =
    value === 100
      ? "bg-green-500"
      : value >= 50
      ? "bg-green-400"
      : value > 0
      ? "bg-yellow-400"
      : "bg-gray-300";

  return (
    <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
      <div
        className={`
          h-full
          ${color}
          transition-all
          duration-500
        `}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}