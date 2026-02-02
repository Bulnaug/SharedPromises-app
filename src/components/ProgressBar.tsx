export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded">
      <div
        className="h-2 bg-green-500 rounded transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
