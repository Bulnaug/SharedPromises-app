import dayjs from "dayjs";

type DayDotProps = {
  date: dayjs.Dayjs;
  isFuture: boolean;
  onClick: () => void;
  colorClass?: string; // новый проп для цвета точки
};

export function DayDot({
  date,
  isFuture,
  onClick,
  colorClass = "bg-gray-300", // по умолчанию серый
}: DayDotProps) {
  return (
    <div className="relative group flex justify-center">
      <button
        disabled={isFuture}
        onClick={onClick}
        className={`
          w-4 h-4 rounded-full transition
          ${isFuture ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
          ${colorClass}
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
