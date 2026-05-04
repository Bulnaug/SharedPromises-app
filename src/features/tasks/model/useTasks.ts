import { useQuery, useMutation } from "convex/react";
import { tasksApi } from "../api/tasksApi";

import type { Id } from "../../../../convex/_generated/dataModel";

export function useTasks() {
  const tasks = useQuery(tasksApi.listMyTasks);
  const toggle = useMutation(tasksApi.toggleTaskCompleted);
  const remove = useMutation(tasksApi.deleteTask);

  return {
    tasks,
    toggleTask: (taskId: Id<"tasks">) => toggle({ taskId }),
    deleteTask: (taskId: Id<"tasks">) => remove({ taskId }),
  };
}
