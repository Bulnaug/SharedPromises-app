type Wish = {
  completedDates: string[];
};

export function build30DaysActivity(wishes: Wish[]) {
  const days: {
    date: string;
    status: "empty" | "partial" | "full";
  }[] = [];

  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);

    const total = wishes.length;
    const done = wishes.filter(w =>
      w.completedDates?.includes(dateStr)
    ).length;

    let status: "empty" | "partial" | "full" = "empty";

    if (done === 0) status = "empty";
    else if (done === total) status = "full";
    else status = "partial";

    days.push({ date: dateStr, status });
  }

  return days;
}
