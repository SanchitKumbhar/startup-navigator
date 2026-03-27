import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ListTodo, Users, FolderKanban, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const STATUS_COLORS = {
  todo: 'hsl(220, 14%, 80%)',
  'in-progress': 'hsl(210, 100%, 52%)',
  done: 'hsl(142, 71%, 45%)',
};

export default function DashboardPage() {
  const { tasks, projects, milestones, activities, teamMembers, getMember } = useApp();

  const tasksByStatus = [
    { name: 'To-Do', value: tasks.filter(t => t.status === 'todo').length, color: STATUS_COLORS.todo },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: STATUS_COLORS['in-progress'] },
    { name: 'Done', value: tasks.filter(t => t.status === 'done').length, color: STATUS_COLORS.done },
  ];

  const memberPerformance = teamMembers.map(m => ({
    name: m.name.split(' ')[0],
    completed: tasks.filter(t => t.assigneeId === m.id && t.status === 'done').length,
    total: tasks.filter(t => t.assigneeId === m.id).length,
  }));

  const overallProgress = tasks.length > 0
    ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)
    : 0;

  const milestoneCompletion = milestones.map(m => ({
    name: m.name.length > 14 ? `${m.name.slice(0, 14)}...` : m.name,
    completion: m.completionPercentage,
  }));

  const avgMilestoneCompletion = milestones.length > 0
    ? Math.round(milestones.reduce((sum, m) => sum + m.completionPercentage, 0) / milestones.length)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ListTodo} label="Total Tasks" value={tasks.length} />
        <StatCard icon={CheckCircle2} label="Completed" value={tasks.filter(t => t.status === 'done').length} />
        <StatCard icon={FolderKanban} label="Projects" value={projects.length} />
        <StatCard icon={Users} label="Team Members" value={teamMembers.length} />
      </div>

      {/* Progress + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader><CardTitle className="text-base">Overall Progress</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Progress value={overallProgress} className="flex-1 h-3" />
              <span className="text-sm font-semibold text-muted-foreground">{overallProgress}%</span>
            </div>
            <div className="space-y-3">
              {projects.map(p => (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-muted-foreground">{p.progress}%</span>
                  </div>
                  <Progress value={p.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Task Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={tasksByStatus} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                  {tasksByStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {tasksByStatus.map(s => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-muted-foreground">{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Team Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={memberPerformance}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="completed" fill="hsl(162, 63%, 41%)" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="total" fill="hsl(220, 14%, 85%)" radius={[4, 4, 0, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Milestone Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Average completion rate</span>
              <span className="font-semibold">{avgMilestoneCompletion}%</span>
            </div>
            <Progress value={avgMilestoneCompletion} className="h-2" />
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={milestoneCompletion}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="completion" fill="hsl(210, 100%, 52%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[200px] overflow-auto">
              {activities.slice(0, 6).map(a => {
                const member = getMember(a.userId);
                return (
                  <div key={a.id} className="flex items-start gap-3 text-sm">
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                      {member?.avatar || '?'}
                    </div>
                    <div>
                      <p><span className="font-medium">{member?.name}</span> {a.action} <span className="font-medium">{a.target}</span></p>
                      <p className="text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <Card className="glass-card">
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
