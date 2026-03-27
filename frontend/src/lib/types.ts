export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  skills: string[];
  tasksCompleted: number;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface TaskComment {
  id: string;
  author: string;
  authorId: string;
  content: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string;
  projectId: string;
  milestoneId?: string;
  dueDate: string;
  comments: TaskComment[];
  createdAt: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  projectId: string;
  dueDate: string;
  completionPercentage: number;
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  status: 'active' | 'completed' | 'on-hold';
  description: string;
  progress: number;
}

export interface Update {
  id: string;
  authorId: string;
  title: string;
  content: string;
  timestamp: string;
  type: 'announcement' | 'update' | 'milestone';
}

export interface ActivityItem {
  id: string;
  userId: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'task' | 'comment' | 'milestone' | 'update';
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'task' | 'milestone' | 'comment';
}
