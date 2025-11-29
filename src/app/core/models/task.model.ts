export interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number;
  assigneeId?: number;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: Date;
  createdAt: Date;
}