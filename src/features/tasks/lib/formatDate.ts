export function formatDate(date?: string) {
  if (!date) return null;

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
