import { TeamMember, Task, Project, Milestone, Update, ActivityItem, Notification } from './types';

export const demoTeamMembers: TeamMember[] = [
  { id: '1', name: 'Alex Chen', role: 'Product Lead', email: 'alex@startup.io', avatar: 'AC', skills: ['Product Strategy', 'UX Design', 'Figma'], tasksCompleted: 14 },
  { id: '2', name: 'Priya Sharma', role: 'Full-Stack Dev', email: 'priya@startup.io', avatar: 'PS', skills: ['React', 'Node.js', 'PostgreSQL'], tasksCompleted: 22 },
  { id: '3', name: 'Marcus Johnson', role: 'Marketing Lead', email: 'marcus@startup.io', avatar: 'MJ', skills: ['Growth Marketing', 'Content', 'Analytics'], tasksCompleted: 11 },
  { id: '4', name: 'Sara Kim', role: 'Designer', email: 'sara@startup.io', avatar: 'SK', skills: ['UI Design', 'Branding', 'Illustration'], tasksCompleted: 17 },
  { id: '5', name: 'Jordan Lee', role: 'Backend Dev', email: 'jordan@startup.io', avatar: 'JL', skills: ['Python', 'AWS', 'DevOps'], tasksCompleted: 19 },
];

export const demoProjects: Project[] = [
  { id: 'p1', name: 'Mobile App v2', ownerId: '1', status: 'active', description: 'Redesign and rebuild the mobile app with new features', progress: 65 },
  { id: 'p2', name: 'Marketing Campaign Q1', ownerId: '3', status: 'active', description: 'Launch multi-channel marketing campaign for Q1', progress: 40 },
  { id: 'p3', name: 'Backend API Refactor', ownerId: '5', status: 'active', description: 'Refactor backend APIs for better performance and scalability', progress: 80 },
];

export const demoMilestones: Milestone[] = [
  { id: 'm1', name: 'Design System Complete', description: 'Finalize all design components and tokens', projectId: 'p1', dueDate: '2026-04-15', completionPercentage: 85 },
  { id: 'm2', name: 'Beta Launch', description: 'Release beta to 100 test users', projectId: 'p1', dueDate: '2026-05-01', completionPercentage: 30 },
  { id: 'm3', name: 'Content Calendar', description: 'Complete content plan for all channels', projectId: 'p2', dueDate: '2026-04-10', completionPercentage: 60 },
  { id: 'm4', name: 'API v3 Release', description: 'Deploy refactored APIs to production', projectId: 'p3', dueDate: '2026-04-20', completionPercentage: 75 },
  { id: 'm5', name: 'Social Media Launch', description: 'Go live on all social platforms', projectId: 'p2', dueDate: '2026-04-25', completionPercentage: 20 },
];

export const demoTasks: Task[] = [
  { id: 't1', title: 'Design onboarding flow', description: 'Create wireframes and high-fi mocks for the new user onboarding', status: 'done', assigneeId: '4', projectId: 'p1', milestoneId: 'm1', dueDate: '2026-04-01', comments: [{ id: 'c1', author: 'Alex Chen', authorId: '1', content: 'Looks great! Let\'s review together.', timestamp: '2026-03-24T10:00:00Z' }], createdAt: '2026-03-20T09:00:00Z' },
  { id: 't2', title: 'Implement auth module', description: 'Build login, signup, and password reset flows', status: 'in-progress', assigneeId: '2', projectId: 'p1', milestoneId: 'm2', dueDate: '2026-04-10', comments: [], createdAt: '2026-03-21T09:00:00Z' },
  { id: 't3', title: 'Write blog posts', description: 'Draft 3 blog posts for launch week', status: 'todo', assigneeId: '3', projectId: 'p2', milestoneId: 'm3', dueDate: '2026-04-08', comments: [{ id: 'c2', author: 'Marcus Johnson', authorId: '3', content: 'Working on outlines first.', timestamp: '2026-03-25T14:00:00Z' }], createdAt: '2026-03-22T09:00:00Z' },
  { id: 't4', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', status: 'done', assigneeId: '5', projectId: 'p3', milestoneId: 'm4', dueDate: '2026-03-28', comments: [], createdAt: '2026-03-18T09:00:00Z' },
  { id: 't5', title: 'Create component library', description: 'Build reusable React components with Storybook documentation', status: 'in-progress', assigneeId: '4', projectId: 'p1', milestoneId: 'm1', dueDate: '2026-04-05', comments: [], createdAt: '2026-03-19T09:00:00Z' },
  { id: 't6', title: 'Social media strategy', description: 'Define target audience and content strategy for social channels', status: 'todo', assigneeId: '3', projectId: 'p2', milestoneId: 'm5', dueDate: '2026-04-15', comments: [], createdAt: '2026-03-23T09:00:00Z' },
  { id: 't7', title: 'Database migration scripts', description: 'Write migration scripts for the new schema changes', status: 'in-progress', assigneeId: '5', projectId: 'p3', milestoneId: 'm4', dueDate: '2026-04-12', comments: [], createdAt: '2026-03-24T09:00:00Z' },
  { id: 't8', title: 'User research interviews', description: 'Conduct 10 user interviews for the new features', status: 'todo', assigneeId: '1', projectId: 'p1', milestoneId: 'm2', dueDate: '2026-04-18', comments: [], createdAt: '2026-03-25T09:00:00Z' },
  { id: 't9', title: 'API documentation', description: 'Write comprehensive API docs for v3 endpoints', status: 'todo', assigneeId: '2', projectId: 'p3', milestoneId: 'm4', dueDate: '2026-04-14', comments: [], createdAt: '2026-03-25T09:00:00Z' },
  { id: 't10', title: 'Landing page redesign', description: 'Update landing page with new branding and messaging', status: 'in-progress', assigneeId: '4', projectId: 'p2', milestoneId: 'm5', dueDate: '2026-04-20', comments: [], createdAt: '2026-03-24T09:00:00Z' },
];

export const demoUpdates: Update[] = [
  { id: 'u1', authorId: '1', title: 'Sprint 4 Kickoff', content: 'We\'re starting Sprint 4 today! Focus areas: onboarding flow, auth module, and marketing content. Let\'s crush it! 🚀', timestamp: '2026-03-25T09:00:00Z', type: 'announcement' },
  { id: 'u2', authorId: '5', title: 'CI/CD Pipeline Live', content: 'The CI/CD pipeline is now fully operational. All PRs will be automatically tested and deployed to staging.', timestamp: '2026-03-24T16:00:00Z', type: 'milestone' },
  { id: 'u3', authorId: '3', title: 'Marketing Update', content: 'Content calendar is 60% complete. Blog posts outlines are ready for review. Social channels will go live next week.', timestamp: '2026-03-24T11:00:00Z', type: 'update' },
];

export const demoActivities: ActivityItem[] = [
  { id: 'a1', userId: '4', action: 'completed task', target: 'Design onboarding flow', timestamp: '2026-03-25T15:00:00Z', type: 'task' },
  { id: 'a2', userId: '1', action: 'commented on', target: 'Design onboarding flow', timestamp: '2026-03-24T10:00:00Z', type: 'comment' },
  { id: 'a3', userId: '5', action: 'completed task', target: 'Set up CI/CD pipeline', timestamp: '2026-03-24T16:00:00Z', type: 'task' },
  { id: 'a4', userId: '3', action: 'created update', target: 'Marketing Update', timestamp: '2026-03-24T11:00:00Z', type: 'update' },
  { id: 'a5', userId: '2', action: 'started working on', target: 'Implement auth module', timestamp: '2026-03-24T09:00:00Z', type: 'task' },
  { id: 'a6', userId: '4', action: 'started working on', target: 'Create component library', timestamp: '2026-03-23T14:00:00Z', type: 'task' },
  { id: 'a7', userId: '1', action: 'posted announcement', target: 'Sprint 4 Kickoff', timestamp: '2026-03-25T09:00:00Z', type: 'update' },
];

export const demoNotifications: Notification[] = [
  { id: 'n1', message: 'Sara Kim completed "Design onboarding flow"', timestamp: '2026-03-25T15:00:00Z', read: false, type: 'task' },
  { id: 'n2', message: 'New milestone: CI/CD Pipeline is live!', timestamp: '2026-03-24T16:00:00Z', read: false, type: 'milestone' },
  { id: 'n3', message: 'Alex Chen commented on your task', timestamp: '2026-03-24T10:00:00Z', read: true, type: 'comment' },
  { id: 'n4', message: 'Sprint 4 has started', timestamp: '2026-03-25T09:00:00Z', read: false, type: 'task' },
];
