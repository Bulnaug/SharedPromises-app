import { useQuery, useMutation } from "convex/react";
import { tasksApi } from "../api/tasksApi";

export function useTasks() {
  const tasks = useQuery(tasksApi.listMyTasks);
  const toggle = useMutation(tasksApi.toggleTaskCompleted);
  const remove = useMutation(tasksApi.deleteTask);

  return {
    tasks,
    toggleTask: (taskId: string) => toggle({ taskId }),
    deleteTask: (taskId: string) => remove({ taskId }),
  };
}
