type ActivityDay = {
  date: string;
  status: "empty" | "partial" | "full";
};

export function Activity30Days({ data }: { data: ActivityDay[] }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-center mb-3">
        Активность за 30 дней
      </h3>

      <div className="grid grid-cols-10 gap-2 justify-center">
        {data.map(day => (
          <div
            key={day.date}
            title={day.date}
            className={`
              w-4 h-4 rounded
              ${
                day.status === "empty"
                  ? "bg-gray-200"
                  : day.status === "partial"
                  ? "bg-green-300"
                  : "bg-green-600"
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}
