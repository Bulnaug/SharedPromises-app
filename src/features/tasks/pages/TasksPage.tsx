import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { TaskCard } from "../components/TaskCard";

export default function TasksPage() {
  const tasks = useQuery(api.tasks.listMyTasks);
  const toggle = useMutation(api.tasks.toggleTaskCompleted);
  const remove = useMutation(api.tasks.deleteTask);

  if (!tasks) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {tasks.map((t) => (
        <TaskCard
          key={t._id}
          {...t}
          onToggle={() => toggle({ taskId: t._id })}
          onDelete={() => remove({ taskId: t._id })}
        />
      ))}
    </div>
  );
}
