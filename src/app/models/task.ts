export interface TaskModel {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  stage: string;
  members: string;
  priority: string;
  elapsed?: number;
}

export interface KanbanTask {
  todo: TaskModel[];
  inProgress: TaskModel[];
  review: TaskModel[];
  done: TaskModel[];
}

export interface KanbanColumn {
  title: string;
  tasks: TaskModel[];
}
