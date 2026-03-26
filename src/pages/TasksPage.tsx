import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, MessageSquare, Trash2, GripVertical, Calendar, Send, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskStatus, Task } from '@/lib/types';

const statusLabels: Record<TaskStatus, string> = {
  'todo': 'To-Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};

const statusStyles: Record<TaskStatus, string> = {
  'todo': 'status-todo',
  'in-progress': 'status-in-progress',
  'done': 'status-done',
};

export default function TasksPage() {
  const { tasks, projects, teamMembers, milestones, getMember, addTask, updateTask, updateTaskStatus, deleteTask, addTaskComment } = useApp();
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterMember, setFilterMember] = useState('all');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [commentTask, setCommentTask] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', assigneeId: '', projectId: '', milestoneId: '', dueDate: '', status: 'todo' as TaskStatus });
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', assigneeId: '', projectId: '', milestoneId: '', dueDate: '', status: 'todo' as TaskStatus });

  const filtered = tasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterMember !== 'all' && t.assigneeId !== filterMember) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAdd = () => {
    if (!newTask.title || !newTask.assigneeId || !newTask.projectId) return;
    addTask(newTask);
    setNewTask({ title: '', description: '', assigneeId: '', projectId: '', milestoneId: '', dueDate: '', status: 'todo' });
    setShowAdd(false);
  };

  const handleComment = (taskId: string) => {
    if (!commentText.trim()) return;
    addTaskComment(taskId, { author: 'You', authorId: '1', content: commentText });
    setCommentText('');
  };

  const handleDrop = (status: TaskStatus) => (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) updateTaskStatus(taskId, status);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description,
      assigneeId: task.assigneeId,
      projectId: task.projectId,
      milestoneId: task.milestoneId || '',
      dueDate: task.dueDate,
      status: task.status,
    });
  };

  const handleEdit = () => {
    if (!editingTask || !editForm.title) return;
    updateTask(editingTask.id, editForm);
    setEditingTask(null);
  };

  const columns: TaskStatus[] = ['todo', 'in-progress', 'done'];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
          <option value="all">All Status</option>
          {columns.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>

        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={filterMember} onChange={e => setFilterMember(e.target.value)}>
          <option value="all">All Members</option>
          {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        <div className="flex gap-1 border border-input rounded-md">
          <button onClick={() => setViewMode('kanban')} className={cn("px-3 py-1.5 text-sm rounded-l-md", viewMode === 'kanban' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>Kanban</button>
          <button onClick={() => setViewMode('list')} className={cn("px-3 py-1.5 text-sm rounded-r-md", viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>List</button>
        </div>

        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 ml-auto"><Plus className="h-4 w-4" /> New Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <Input placeholder="Task title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
              <Textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={newTask.assigneeId} onChange={e => setNewTask({ ...newTask, assigneeId: e.target.value })}>
                  <option value="">Assign to...</option>
                  {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={newTask.projectId} onChange={e => setNewTask({ ...newTask, projectId: e.target.value })}>
                  <option value="">Project...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <Input type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
              <Button onClick={handleAdd} className="w-full">Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={open => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <Input placeholder="Task title" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
            <Textarea placeholder="Description" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={editForm.assigneeId} onChange={e => setEditForm({ ...editForm, assigneeId: e.target.value })}>
                <option value="">Assign to...</option>
                {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={editForm.projectId} onChange={e => setEditForm({ ...editForm, projectId: e.target.value })}>
                <option value="">Project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={editForm.milestoneId} onChange={e => setEditForm({ ...editForm, milestoneId: e.target.value })}>
                <option value="">Milestone...</option>
                {milestones.filter(m => m.projectId === editForm.projectId).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value as TaskStatus })}>
                {columns.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
            <Input type="date" value={editForm.dueDate} onChange={e => setEditForm({ ...editForm, dueDate: e.target.value })} />
            <Button onClick={handleEdit} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(status => (
            <div
              key={status}
              className="space-y-3"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop(status)}
            >
              <div className="flex items-center gap-2">
                <Badge className={statusStyles[status]}>{statusLabels[status]}</Badge>
                <span className="text-sm text-muted-foreground">
                  {filtered.filter(t => t.status === status).length}
                </span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {filtered.filter(t => t.status === status).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={deleteTask}
                    onEdit={() => openEdit(task)}
                    onComment={() => setCommentTask(commentTask === task.id ? null : task.id)}
                    showComments={commentTask === task.id}
                    commentText={commentText}
                    onCommentTextChange={setCommentText}
                    onSubmitComment={() => handleComment(task.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onEdit={() => openEdit(task)}
              onComment={() => setCommentTask(commentTask === task.id ? null : task.id)}
              showComments={commentTask === task.id}
              commentText={commentText}
              onCommentTextChange={setCommentText}
              onSubmitComment={() => handleComment(task.id)}
              horizontal
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: () => void;
  onComment: () => void;
  showComments: boolean;
  commentText: string;
  onCommentTextChange: (v: string) => void;
  onSubmitComment: () => void;
  horizontal?: boolean;
}

function TaskCard({ task, onDelete, onEdit, onComment, showComments, commentText, onCommentTextChange, onSubmitComment, horizontal }: TaskCardProps) {
  const { getMember } = useApp();
  const assignee = getMember(task.assigneeId);
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <Card
      className={cn("glass-card hover:shadow-md transition-shadow", horizontal && "flex-row")}
      draggable
      onDragStart={e => e.dataTransfer.setData('taskId', task.id)}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 cursor-grab shrink-0" />
            <div>
              <h4 className="text-sm font-medium leading-tight">{task.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={onEdit} className="text-muted-foreground hover:text-foreground transition-colors">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => onDelete(task.id)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={cn("text-[10px]", statusStyles[task.status])}>
            {statusLabels[task.status]}
          </Badge>
          {isOverdue && <Badge className="status-overdue text-[10px]">Overdue</Badge>}
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <Calendar className="h-3 w-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold">
              {assignee?.avatar}
            </div>
            <span className="text-xs text-muted-foreground">{assignee?.name}</span>
          </div>
          <button onClick={onComment} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <MessageSquare className="h-3.5 w-3.5" />
            {task.comments.length}
          </button>
        </div>

        {showComments && (
          <div className="space-y-2 pt-2 border-t border-border">
            {task.comments.map(c => (
              <div key={c.id} className="text-xs space-y-0.5">
                <div className="flex gap-2">
                  <span className="font-medium">{c.author}</span>
                  <span className="text-muted-foreground">{new Date(c.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-muted-foreground">{c.content}</p>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={e => onCommentTextChange(e.target.value)}
                className="text-xs h-8"
                onKeyDown={e => e.key === 'Enter' && onSubmitComment()}
              />
              <Button size="sm" variant="ghost" onClick={onSubmitComment} className="h-8 px-2">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
