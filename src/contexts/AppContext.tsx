import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  TeamMember, Task, Project, Milestone, Update, ActivityItem, Notification, TaskStatus, TaskComment, StartupProgress, StartupStage
} from '@/lib/types';
import {
  demoTeamMembers, demoTasks, demoProjects, demoMilestones, demoUpdates, demoActivities, demoNotifications, demoStartupProgress
} from '@/lib/demo-data';

interface AppContextType {
  teamMembers: TeamMember[];
  tasks: Task[];
  projects: Project[];
  milestones: Milestone[];
  updates: Update[];
  activities: ActivityItem[];
  notifications: Notification[];
  startupProgress: StartupProgress;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'avatar' | 'tasksCompleted'>) => void;
  addTask: (task: Omit<Task, 'id' | 'comments' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  addTaskComment: (taskId: string, comment: Omit<TaskComment, 'id' | 'timestamp'>) => void;
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  addUpdate: (update: Omit<Update, 'id' | 'timestamp'>) => void;
  updateStartupStage: (stage: StartupStage) => void;
  updateStartupFocus: (focus: string) => void;
  updateStartupMetric: (metricId: string, updates: { current?: number; target?: number }) => void;
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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(demoTeamMembers);
  const [tasks, setTasks] = useState<Task[]>(demoTasks);
  const [projects] = useState<Project[]>(demoProjects);
  const [milestones, setMilestones] = useState<Milestone[]>(demoMilestones);
  const [updates, setUpdates] = useState<Update[]>(demoUpdates);
  const [activities, setActivities] = useState<ActivityItem[]>(demoActivities);
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [startupProgress, setStartupProgress] = useState<StartupProgress>(demoStartupProgress);

  const addActivity = useCallback((userId: string, action: string, target: string, type: ActivityItem['type']) => {
    setActivities(prev => [{ id: `a${Date.now()}`, userId, action, target, timestamp: new Date().toISOString(), type }, ...prev]);
  }, []);

  const pushNotification = useCallback((message: string, type: Notification['type']) => {
    setNotifications(prev => [{
      id: `n${Date.now()}`,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    }, ...prev]);
  }, []);

  const addTeamMember = useCallback((member: Omit<TeamMember, 'id' | 'avatar' | 'tasksCompleted'>) => {
    const initials = member.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() || '')
      .join('') || 'TM';

    const newMember: TeamMember = {
      ...member,
      id: `tm${Date.now()}`,
      avatar: initials,
      tasksCompleted: 0,
    };

    setTeamMembers(prev => [...prev, newMember]);
    addActivity(newMember.id, 'joined team', newMember.name, 'update');
    pushNotification(`New team member added: ${newMember.name}`, 'task');
  }, [addActivity, pushNotification]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'comments' | 'createdAt'>) => {
    const newTask: Task = { ...task, id: `t${Date.now()}`, comments: [], createdAt: new Date().toISOString() };
    setTasks(prev => [...prev, newTask]);
    addActivity(task.assigneeId, 'created task', task.title, 'task');
    pushNotification(`New task assigned: ${task.title}`, 'task');
  }, [addActivity, pushNotification]);

  const updateTask = useCallback((id: string, upd: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const merged = { ...t, ...upd };
      if (upd.assigneeId && upd.assigneeId !== t.assigneeId) {
        addActivity(upd.assigneeId, 'reassigned task', merged.title, 'task');
        pushNotification(`Task reassigned: ${merged.title}`, 'task');
      }
      return merged;
    }));
  }, [addActivity, pushNotification]);

  const deleteTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    if (task) {
      addActivity(task.assigneeId, 'deleted task', task.title, 'task');
      pushNotification(`Task deleted: ${task.title}`, 'task');
    }
  }, [tasks, addActivity, pushNotification]);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      return { ...t, status };
    }));
    const task = tasks.find(t => t.id === id);
    if (task) {
      addActivity(task.assigneeId, status === 'done' ? 'completed task' : 'updated task', task.title, 'task');
      pushNotification(`Task status updated: ${task.title} -> ${status}`, 'task');
    }
  }, [tasks, addActivity, pushNotification]);

  const addTaskComment = useCallback((taskId: string, comment: Omit<TaskComment, 'id' | 'timestamp'>) => {
    const newComment: TaskComment = { ...comment, id: `c${Date.now()}`, timestamp: new Date().toISOString() };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t));
    const taskTitle = tasks.find(t => t.id === taskId)?.title || '';
    addActivity(comment.authorId, 'commented on', taskTitle, 'comment');
    pushNotification(`New comment on task: ${taskTitle}`, 'comment');
  }, [tasks, addActivity, pushNotification]);

  const addMilestone = useCallback((milestone: Omit<Milestone, 'id'>) => {
    setMilestones(prev => [...prev, { ...milestone, id: `m${Date.now()}` }]);
    const ownerId = projects.find(p => p.id === milestone.projectId)?.ownerId || '1';
    addActivity(ownerId, 'created milestone', milestone.name, 'milestone');
    pushNotification(`Milestone added: ${milestone.name}`, 'milestone');
  }, [projects, addActivity, pushNotification]);

  const updateMilestone = useCallback((id: string, upd: Partial<Milestone>) => {
    const milestone = milestones.find(m => m.id === id);
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...upd } : m));
    if (milestone) {
      const ownerId = projects.find(p => p.id === milestone.projectId)?.ownerId || '1';
      addActivity(ownerId, 'updated milestone', milestone.name, 'milestone');
      if ((upd.completionPercentage ?? milestone.completionPercentage) >= 100) {
        pushNotification(`Milestone completed: ${milestone.name}`, 'milestone');
      } else {
        pushNotification(`Milestone updated: ${milestone.name}`, 'milestone');
      }
    }
  }, [milestones, projects, addActivity, pushNotification]);

  const addUpdate = useCallback((update: Omit<Update, 'id' | 'timestamp'>) => {
    const newUpdate: Update = { ...update, id: `u${Date.now()}`, timestamp: new Date().toISOString() };
    setUpdates(prev => [newUpdate, ...prev]);
    addActivity(update.authorId, 'posted update', update.title, 'update');
    pushNotification(`New update: ${update.title}`, 'task');
  }, [addActivity, pushNotification]);

  const updateStartupStage = useCallback((stage: StartupStage) => {
    setStartupProgress(prev => ({ ...prev, stage }));
    addActivity('1', 'updated startup stage to', stage, 'update');
    pushNotification(`Startup stage updated to ${stage}`, 'milestone');
  }, [addActivity, pushNotification]);

  const updateStartupFocus = useCallback((focus: string) => {
    setStartupProgress(prev => ({ ...prev, weeklyFocus: focus }));
    addActivity('1', 'updated weekly focus', focus.slice(0, 40), 'update');
  }, [addActivity]);

  const updateStartupMetric = useCallback((metricId: string, updates: { current?: number; target?: number }) => {
    setStartupProgress(prev => ({
      ...prev,
      metrics: prev.metrics.map(metric => metric.id === metricId ? { ...metric, ...updates } : metric),
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const getMember = useCallback((id: string) => teamMembers.find(m => m.id === id), [teamMembers]);

  return (
    <AppContext.Provider value={{
      teamMembers, tasks, projects, milestones, updates, activities, notifications,
      startupProgress,
      addTeamMember,
      addTask, updateTask, deleteTask, updateTaskStatus, addTaskComment,
      addMilestone, updateMilestone, addUpdate, markNotificationRead, getMember,
      updateStartupStage, updateStartupFocus, updateStartupMetric,
    }}>
      {children}
    </AppContext.Provider>
  );
};
