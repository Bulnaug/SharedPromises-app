export type Task = {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: number;
};
