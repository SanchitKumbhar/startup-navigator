# Startup Navigator Documentation

## 1. Product Overview
Startup Navigator is a web application for startup teams to plan, execute, and track progress across projects, tasks, milestones, team activity, and startup KPIs.

It is designed for founders and cross-functional teams that need a single workspace to:
- Manage day-to-day execution.
- Track project and milestone progress.
- Coordinate team contributions.
- Share internal updates.
- Monitor startup business KPIs through a manual, non-AI progress tracker.

## 2. What the Tool Provides
Startup Navigator provides six primary workspaces:
1. Dashboard: high-level execution analytics and team activity.
2. Startup Progress: stage, weekly focus, and KPI progress tracking (manual and rule-based, no AI).
3. Team: member directory with skills and workload visibility.
4. Projects: project status and milestone planning.
5. Tasks: kanban/list task execution with assignment, due dates, and comments.
6. Updates: internal communication feed for announcements, milestones, and progress notes.

## 3. Key Features

### 3.1 Dashboard
- Overall progress from completed tasks.
- Task distribution (To-Do, In Progress, Done).
- Team performance chart by completed tasks.
- Milestone completion analytics.
- Recent activity feed.

### 3.2 Startup Progress (Manual, Non-AI)
- Startup stage selector: Idea, MVP, Traction, Growth, Scale.
- Stage guidance text for current phase.
- Weekly focus editor for operational priorities.
- KPI progress tracker with editable Current and Target values.
- Rule-based progress score from KPI target attainment.
- Handles lower-is-better KPIs (for example churn and burn) with inverse ratio logic.

Important: This page does not use AI predictions, AI recommendations, or AI-generated strategy.

### 3.3 Team Management
- Search team members by name and role.
- Add new members with role, email, and skills.
- Skill tags and per-member task completion visibility.

### 3.4 Project and Milestone Management
- View active projects with owner and progress.
- Add milestones to projects.
- Edit milestone details and completion percentage.
- Sort milestones by due date or progress.
- Linked-task visibility per milestone.
- Automatic overdue milestone indication.

### 3.5 Task Management
- Create, edit, and delete tasks.
- Assign tasks to team members and projects.
- Link tasks to milestones.
- Due-date based filtering: all, overdue, today, this week.
- Status and member filtering.
- Search across task title, description, assignee, project, and milestone.
- Kanban drag-and-drop status updates.
- List view alternative.
- Task comments and activity updates.
- Overdue task badge for delayed open tasks.

### 3.6 Updates Feed
- Post startup updates with type:
  - Update
  - Announcement
  - Milestone
- Choose author from team members.
- Timeline feed with badges and timestamps.

### 3.7 Notifications and Activity
- Notification center in header.
- Unread badge count.
- Mark notifications as read.
- Activity logging for task, milestone, and update events.

### 3.8 UI/UX Features
- Responsive layout (desktop and mobile).
- Mobile sidebar with overlay.
- Collapsible desktop sidebar.
- Light/Dark mode toggle with local preference persistence.

## 4. Typical Team Workflow
1. Set startup stage and weekly focus in Startup Progress.
2. Define or update projects and milestones.
3. Create tasks linked to projects/milestones and assign owners.
4. Execute in Kanban or List view.
5. Share weekly updates in Updates.
6. Review Dashboard for execution and milestone health.

## 5. User Roles (Suggested)
Startup Navigator currently does not enforce role-based access control. Suggested usage model:
- Founder/Product Lead: startup stage, KPI targets, strategic updates.
- Engineering/Execution Leads: projects, milestones, and task execution.
- Team Members: task updates, comments, and status progress.

## 6. Data Model Summary
Primary entities managed in app state:
- TeamMember
- Task
- TaskComment
- Project
- Milestone
- Update
- ActivityItem
- Notification
- StartupProgress
- StartupMetric

## 7. Technical Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui components
- Recharts for visual analytics
- Radix UI primitives
- React Query provider present in app setup

## 8. Current Architecture Notes
- Frontend-only application state via React Context.
- Demo seed data initializes the application.
- No backend API integration yet.
- No persistent database yet (state resets on reload unless theme preference).

## 9. Run and Development

### 9.1 Prerequisites
- Node.js 18+
- npm

### 9.2 Commands
- Install dependencies:

```bash
npm install
```

- Start development server:

```bash
npm run dev
```

- Build production bundle:

```bash
npm run build
```

- Run tests:

```bash
npm run test
```

- Lint code:

```bash
npm run lint
```

## 10. Known Limitations
- No authentication/authorization.
- No server-side persistence.
- No API/webhook integrations.
- Single-workspace in-memory collaboration model.

## 11. Suggested Next Enhancements
1. Persistent storage (backend or local persistence layer).
2. Role-based access and auth.
3. File attachments for tasks and updates.
4. KPI history snapshots and trend charts.
5. CSV import/export for tasks and metrics.
6. Audit trail export and reporting.

## 12. Non-AI Commitment for Startup Progress
The Startup Progress module is intentionally manual and deterministic:
- Inputs are provided by users.
- Scoring is computed with rule-based formulas.
- There are no AI forecasts, recommendations, or generated strategy outputs.
