import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Target, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type MilestoneSort = 'due-asc' | 'due-desc' | 'progress-asc' | 'progress-desc';

export default function ProjectsPage() {
  const { projects, milestones, tasks, getMember, addMilestone, updateMilestone } = useApp();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMs, setNewMs] = useState({ name: '', description: '', dueDate: '', projectId: '' });
  const [milestoneSort, setMilestoneSort] = useState<MilestoneSort>('due-asc');

  const handleAddMilestone = () => {
    if (!newMs.name || !newMs.projectId) return;
    addMilestone({ ...newMs, completionPercentage: 0 });
    setNewMs({ name: '', description: '', dueDate: '', projectId: '' });
    setShowAddMilestone(false);
  };

  const sortMilestones = (list: typeof milestones) => {
    return [...list].sort((a, b) => {
      switch (milestoneSort) {
        case 'due-asc': return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'due-desc': return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'progress-asc': return a.completionPercentage - b.completionPercentage;
        case 'progress-desc': return b.completionPercentage - a.completionPercentage;
        default: return 0;
      }
    });
  };

  const cycleMilestoneSort = () => {
    const order: MilestoneSort[] = ['due-asc', 'due-desc', 'progress-desc', 'progress-asc'];
    const idx = order.indexOf(milestoneSort);
    setMilestoneSort(order[(idx + 1) % order.length]);
  };

  const sortLabel: Record<MilestoneSort, string> = {
    'due-asc': 'Due ↑',
    'due-desc': 'Due ↓',
    'progress-desc': 'Progress ↓',
    'progress-asc': 'Progress ↑',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Active Projects</h2>
        <Dialog open={showAddMilestone} onOpenChange={setShowAddMilestone}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Milestone</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newMs.projectId}
                onChange={e => setNewMs({ ...newMs, projectId: e.target.value })}
              >
                <option value="">Select project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <Input placeholder="Milestone name" value={newMs.name} onChange={e => setNewMs({ ...newMs, name: e.target.value })} />
              <Input placeholder="Description" value={newMs.description} onChange={e => setNewMs({ ...newMs, description: e.target.value })} />
              <Input type="date" value={newMs.dueDate} onChange={e => setNewMs({ ...newMs, dueDate: e.target.value })} />
              <Button onClick={handleAddMilestone} className="w-full">Add Milestone</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map(project => {
          const owner = getMember(project.ownerId);
          const projectMilestones = sortMilestones(milestones.filter(m => m.projectId === project.id));
          const projectTasks = tasks.filter(t => t.projectId === project.id);

          return (
            <Card
              key={project.id}
              className={cn("glass-card cursor-pointer hover:shadow-md transition-shadow", selectedProject === project.id && "ring-2 ring-primary")}
              onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{project.name}</CardTitle>
                  <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Owner: {owner?.name}</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />

                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{projectTasks.length} tasks</span>
                  <span>{projectMilestones.length} milestones</span>
                </div>

                {selectedProject === project.id && projectMilestones.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-border" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Target className="h-4 w-4 text-primary" /> Milestones
                      </div>
                      <button
                        onClick={cycleMilestoneSort}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowUpDown className="h-3 w-3" />
                        {sortLabel[milestoneSort]}
                      </button>
                    </div>
                    {projectMilestones.map(ms => {
                      const linkedTasks = tasks.filter(t => t.milestoneId === ms.id);
                      return (
                        <div key={ms.id} className="space-y-2 p-3 rounded-md bg-secondary/50">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{ms.name}</span>
                            <span className="text-muted-foreground">{ms.completionPercentage}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{ms.description}</p>
                          <Progress value={ms.completionPercentage} className="h-1.5" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Due: {new Date(ms.dueDate).toLocaleDateString()}</span>
                            <span>{linkedTasks.length} linked tasks</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
