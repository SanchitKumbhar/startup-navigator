import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Target, ArrowUpDown, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Milestone } from '@/lib/types';

type MilestoneSort = 'due-asc' | 'due-desc' | 'progress-asc' | 'progress-desc';

export default function ProjectsPage() {
  const { projects, milestones, tasks, getMember, addMilestone, updateMilestone } = useApp();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMs, setNewMs] = useState({ name: '', description: '', dueDate: '', projectId: '' });
  const [milestoneSort, setMilestoneSort] = useState<MilestoneSort>('due-asc');
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [editMs, setEditMs] = useState({ name: '', description: '', dueDate: '', completionPercentage: 0 });

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

  const openMilestoneEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setEditMs({
      name: milestone.name,
      description: milestone.description,
      dueDate: milestone.dueDate,
      completionPercentage: milestone.completionPercentage,
    });
  };

  const handleSaveMilestone = () => {
    if (!editingMilestone || !editMs.name.trim()) return;
    updateMilestone(editingMilestone.id, editMs);
    setEditingMilestone(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Dialog open={!!editingMilestone} onOpenChange={open => !open && setEditingMilestone(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Milestone</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <Input placeholder="Milestone name" value={editMs.name} onChange={e => setEditMs({ ...editMs, name: e.target.value })} />
            <Input placeholder="Description" value={editMs.description} onChange={e => setEditMs({ ...editMs, description: e.target.value })} />
            <Input type="date" value={editMs.dueDate} onChange={e => setEditMs({ ...editMs, dueDate: e.target.value })} />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-medium">{editMs.completionPercentage}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={editMs.completionPercentage}
                onChange={e => setEditMs({ ...editMs, completionPercentage: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <Button onClick={handleSaveMilestone} className="w-full">Save Milestone</Button>
          </div>
        </DialogContent>
      </Dialog>

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
                      const milestoneIsOverdue = new Date(ms.dueDate) < new Date() && ms.completionPercentage < 100;
                      return (
                        <div key={ms.id} className="space-y-2 p-3 rounded-md bg-secondary/50">
                          <div className="flex justify-between items-start gap-2 text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">{ms.name}</span>
                                {ms.completionPercentage >= 100 && <Badge className="status-done text-[10px]">Completed</Badge>}
                                {milestoneIsOverdue && <Badge className="status-overdue text-[10px]">Overdue</Badge>}
                              </div>
                              <p className="text-xs text-muted-foreground">{ms.description}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-muted-foreground">{ms.completionPercentage}%</span>
                              <button
                                onClick={() => openMilestoneEdit(ms)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                          <Progress value={ms.completionPercentage} className="h-1.5" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Due: {new Date(ms.dueDate).toLocaleDateString()}</span>
                            <span>{linkedTasks.length} linked tasks</span>
                          </div>
                          {linkedTasks.length > 0 && (
                            <div className="pt-1 space-y-1">
                              {linkedTasks.slice(0, 3).map(task => (
                                <p key={task.id} className="text-xs text-muted-foreground line-clamp-1">• {task.title}</p>
                              ))}
                              {linkedTasks.length > 3 && (
                                <p className="text-xs text-muted-foreground">+{linkedTasks.length - 3} more tasks</p>
                              )}
                            </div>
                          )}
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
