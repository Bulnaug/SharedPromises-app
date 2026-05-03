import { CalendarDays, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { formatDate } from "../lib/formatDate";

export function TaskCard({
  title,
  description,
  dueDate,
  completed,
  onToggle,
  onDelete,
}: {
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="flex justify-between">
        <div>
          <div className={completed ? "line-through" : ""}>{title}</div>
          {description && <div className="text-sm">{description}</div>}
          {dueDate && (
            <div className="flex gap-1 text-sm">
              <CalendarDays size={14} /> {formatDate(dueDate)}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onToggle}>
            {completed ? <CheckCircle2 /> : <Circle />}
          </button>
          <button onClick={onDelete}>
            <Trash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
