import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  TeamMember, Task, Project, Milestone, Update, ActivityItem, Notification, TaskStatus, TaskComment
} from '@/lib/types';
import {
  demoTeamMembers, demoTasks, demoProjects, demoMilestones, demoUpdates, demoActivities, demoNotifications
} from '@/lib/demo-data';

interface AppContextType {
  teamMembers: TeamMember[];
  tasks: Task[];
  projects: Project[];
  milestones: Milestone[];
  updates: Update[];
  activities: ActivityItem[];
  notifications: Notification[];
  addTask: (task: Omit<Task, 'id' | 'comments' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  addTaskComment: (taskId: string, comment: Omit<TaskComment, 'id' | 'timestamp'>) => void;
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  addUpdate: (update: Omit<Update, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  getMember: (id: string) => TeamMember | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teamMembers] = useState<TeamMember[]>(demoTeamMembers);
  const [tasks, setTasks] = useState<Task[]>(demoTasks);
  const [projects] = useState<Project[]>(demoProjects);
  const [milestones, setMilestones] = useState<Milestone[]>(demoMilestones);
  const [updates, setUpdates] = useState<Update[]>(demoUpdates);
  const [activities, setActivities] = useState<ActivityItem[]>(demoActivities);
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);

  const addActivity = useCallback((userId: string, action: string, target: string, type: ActivityItem['type']) => {
    setActivities(prev => [{ id: `a${Date.now()}`, userId, action, target, timestamp: new Date().toISOString(), type }, ...prev]);
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id' | 'comments' | 'createdAt'>) => {
    const newTask: Task = { ...task, id: `t${Date.now()}`, comments: [], createdAt: new Date().toISOString() };
    setTasks(prev => [...prev, newTask]);
    addActivity(task.assigneeId, 'created task', task.title, 'task');
  }, [addActivity]);

  const updateTask = useCallback((id: string, upd: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...upd } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      return { ...t, status };
    }));
    const task = tasks.find(t => t.id === id);
    if (task) addActivity(task.assigneeId, status === 'done' ? 'completed task' : 'updated task', task.title, 'task');
  }, [tasks, addActivity]);

  const addTaskComment = useCallback((taskId: string, comment: Omit<TaskComment, 'id' | 'timestamp'>) => {
    const newComment: TaskComment = { ...comment, id: `c${Date.now()}`, timestamp: new Date().toISOString() };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t));
    addActivity(comment.authorId, 'commented on', tasks.find(t => t.id === taskId)?.title || '', 'comment');
  }, [tasks, addActivity]);

  const addMilestone = useCallback((milestone: Omit<Milestone, 'id'>) => {
    setMilestones(prev => [...prev, { ...milestone, id: `m${Date.now()}` }]);
  }, []);

  const updateMilestone = useCallback((id: string, upd: Partial<Milestone>) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...upd } : m));
  }, []);

  const addUpdate = useCallback((update: Omit<Update, 'id' | 'timestamp'>) => {
    const newUpdate: Update = { ...update, id: `u${Date.now()}`, timestamp: new Date().toISOString() };
    setUpdates(prev => [newUpdate, ...prev]);
    addActivity(update.authorId, 'posted update', update.title, 'update');
    setNotifications(prev => [{ id: `n${Date.now()}`, message: `New update: ${update.title}`, timestamp: new Date().toISOString(), read: false, type: 'task' }, ...prev]);
  }, [addActivity]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const getMember = useCallback((id: string) => teamMembers.find(m => m.id === id), [teamMembers]);

  return (
    <AppContext.Provider value={{
      teamMembers, tasks, projects, milestones, updates, activities, notifications,
      addTask, updateTask, deleteTask, updateTaskStatus, addTaskComment,
      addMilestone, updateMilestone, addUpdate, markNotificationRead, getMember,
    }}>
      {children}
    </AppContext.Provider>
  );
};
