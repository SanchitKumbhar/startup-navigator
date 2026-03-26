import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Megaphone, TrendingUp, Info, Plus } from 'lucide-react';

const typeIcons = {
  announcement: Megaphone,
  milestone: TrendingUp,
  update: Info,
};

const typeColors = {
  announcement: 'bg-accent text-accent-foreground',
  milestone: 'bg-success text-success-foreground',
  update: 'bg-info text-info-foreground',
};

export default function UpdatesPage() {
  const { updates, addUpdate, getMember, teamMembers } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', authorId: '1', type: 'update' as const });

  const handleSubmit = () => {
    if (!form.title || !form.content) return;
    addUpdate(form);
    setForm({ title: '', content: '', authorId: '1', type: 'update' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Startup Updates</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5">
          <Plus className="h-4 w-4" /> New Update
        </Button>
      </div>

      {showForm && (
        <Card className="glass-card">
          <CardContent className="pt-6 space-y-3">
            <Input placeholder="Update title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="What's the update?" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={3} />
            <div className="flex gap-3">
              <select className="rounded-md border border-input bg-background px-3 py-2 text-sm flex-1" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}>
                <option value="update">Update</option>
                <option value="announcement">Announcement</option>
                <option value="milestone">Milestone</option>
              </select>
              <select className="rounded-md border border-input bg-background px-3 py-2 text-sm flex-1" value={form.authorId} onChange={e => setForm({ ...form, authorId: e.target.value })}>
                {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Post Update</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {updates.map(update => {
          const author = getMember(update.authorId);
          const Icon = typeIcons[update.type];

          return (
            <Card key={update.id} className="glass-card">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                    {author?.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{update.title}</h3>
                      <Badge className={`text-[10px] ${typeColors[update.type]}`}>
                        <Icon className="h-3 w-3 mr-1" />{update.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {author?.name} · {new Date(update.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{update.content}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
