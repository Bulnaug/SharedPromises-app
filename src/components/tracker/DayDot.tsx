import dayjs from "dayjs";

type DayDotProps = {
  date: dayjs.Dayjs;
  hasWishes: boolean;
  isFuture: boolean;
  onClick: () => void;
};

export function DayDot({
  date,
  hasWishes,
  isFuture,
  onClick,
}: DayDotProps) {
  return (
    <div className="relative group flex justify-center">
      <button
        disabled={isFuture}
        onClick={onClick}
        className={`
          w-4 h-4 rounded-full transition
          ${isFuture ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
          ${hasWishes ? "bg-green-500" : "bg-gray-300"}
          hover:scale-110
        `}
      />

      {/* Tooltip */}
      <div
        className="
          absolute -top-7 left-1/2 -translate-x-1/2
          whitespace-nowrap text-xs px-2 py-1 rounded
          bg-black text-white opacity-0
          group-hover:opacity-100 transition
          pointer-events-none
        "
      >
        {date.format("D MMMM YYYY")}
      </div>
    </div>
  );
}
