import { TaskCard } from "../components/TaskCard";
import { useTasks } from "../model/useTasks";

export default function TasksPage() {
  const { tasks, toggleTask, deleteTask } = useTasks();

  if (!tasks) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {tasks.map((t) => (
        <TaskCard
          key={t._id}
          {...t}
          onToggle={() => toggleTask(t._id)}
          onDelete={() => deleteTask(t._id)}
        />
      ))}
    </div>
  );
}
