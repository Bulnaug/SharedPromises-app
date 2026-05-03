import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Trash2,
} from "lucide-react";
import { useTasks } from "../model/useTasks";

function formatDate(date?: string) {
  if (!date) return null;

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export default function TasksPage() {
  const { tasks, toggleTask, deleteTask } = useTasks();

  if (tasks === undefined) {
    return (
      <div className="rounded-2xl border px-5 py-4 shadow-sm bg-white border-gray-100 dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Загрузка задач...
        </div>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  const activeTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  return (
    <div className="relative space-y-8 text-slate-900 dark:text-slate-100">
      <header className="rounded-2xl border px-5 py-4 shadow-sm bg-white border-gray-100 dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Задачи
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Личный список задач с датами и выполнением
            </p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-3 gap-3 md:gap-4">
        <SummaryCard label="Всего" value={tasks.length} />
        <SummaryCard label="Активные" value={activeTasks.length} />
        <SummaryCard label="Готово" value={completedTasks.length} />
      </section>

      <TaskSection
        icon={<Circle size={17} className="text-emerald-500" />}
        title="Активные"
        tasks={activeTasks}
        emptyText="Пока нет активных задач"
        onToggle={toggleTask}
        onDelete={deleteTask}
      />

      <TaskSection
        icon={<CheckCircle2 size={17} className="text-emerald-500" />}
        title="Выполненные"
        tasks={completedTasks}
        emptyText="Пока нет выполненных задач"
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border px-4 py-3 shadow-sm bg-white border-gray-100 dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none">
      <div className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </div>
    </div>
  );
}

type TaskItem = {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
};

function TaskSection({
  icon,
  title,
  tasks,
  emptyText,
  onToggle,
  onDelete,
}: {
  icon: React.ReactNode;
  title: string;
  tasks: TaskItem[];
  emptyText: string;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}) {
  return (
    <section className="rounded-2xl border p-5 md:p-6 space-y-5 shadow-sm bg-white border-gray-100 dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none">
      <SectionTitle icon={icon} title={title} count={tasks.length} />

      {tasks.length === 0 ? (
        <EmptyState text={emptyText} />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              title={task.title}
              description={task.description}
              dueDate={task.dueDate}
              completed={task.completed}
              onToggle={() => onToggle(task._id)}
              onDelete={() => onDelete(task._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SectionTitle({ icon, title, count }: { icon: React.ReactNode; title: string; count: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
      </div>
      <div className="rounded-full border px-2.5 py-1 text-xs font-medium border-gray-200 text-slate-500 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
        {count}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed p-6 text-center border-gray-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-900/40">
      <div className="text-sm text-slate-500 dark:text-slate-400">{text}</div>
    </div>
  );
}

function TaskCard({
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
    <div className="rounded-2xl border p-4 shadow-sm bg-white border-gray-100 dark:bg-slate-900/70 dark:border-slate-700/60 dark:shadow-none">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="pt-0.5 shrink-0">
              {completed ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : (
                <Circle size={18} className="text-slate-300 dark:text-slate-600" />
              )}
            </div>
            <div className="min-w-0 space-y-1.5">
              <h3 className={completed ? "text-base font-medium line-through text-slate-500 dark:text-slate-400" : "text-base font-medium text-slate-900 dark:text-slate-100"}>
                {title}
              </h3>
              {description && (
                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
              )}
              {dueDate && (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <CalendarDays size={15} />
                  <span>{formatDate(dueDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-end md:self-auto">
          <button type="button" onClick={onToggle} className="rounded-xl border px-3 py-2 text-sm font-medium border-gray-200 text-slate-700 bg-white transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
            {completed ? "Вернуть" : "Готово"}
          </button>
          <button type="button" onClick={onDelete} className="rounded-xl border p-2.5 border-gray-200 text-slate-500 bg-white transition hover:bg-slate-50 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800" aria-label="Удалить задачу">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
