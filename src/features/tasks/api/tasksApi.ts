import { api } from "../../../../convex/_generated/api";

export const tasksApi = {
  listMyTasks: api.tasks.listMyTasks,
  createTask: api.tasks.createTask,
  toggleTaskCompleted: api.tasks.toggleTaskCompleted,
  deleteTask: api.tasks.deleteTask,
};
