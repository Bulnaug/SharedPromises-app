export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="
          h-full
          bg-gradient-to-r
          from-green-400
          to-green-600
          transition-all
          duration-500
          ease-out
        "
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
