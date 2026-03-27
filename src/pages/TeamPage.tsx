import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function TeamPage() {
  const { teamMembers, tasks, addTeamMember } = useApp();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    skills: '',
  });

  const filtered = teamMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.role.trim() || !newMember.email.trim()) return;

    const skills = newMember.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean);

    addTeamMember({
      name: newMember.name.trim(),
      role: newMember.role.trim(),
      email: newMember.email.trim(),
      skills,
    });

    setNewMember({ name: '', role: '', email: '', skills: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Team Member</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <Input
                placeholder="Full name"
                value={newMember.name}
                onChange={e => setNewMember({ ...newMember, name: e.target.value })}
              />
              <Input
                placeholder="Role"
                value={newMember.role}
                onChange={e => setNewMember({ ...newMember, role: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email"
                value={newMember.email}
                onChange={e => setNewMember({ ...newMember, email: e.target.value })}
              />
              <Input
                placeholder="Skills (comma separated)"
                value={newMember.skills}
                onChange={e => setNewMember({ ...newMember, skills: e.target.value })}
              />
              <Button onClick={handleAddMember} className="w-full">Save Member</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(member => {
          const memberTasks = tasks.filter(t => t.assigneeId === member.id);
          const done = memberTasks.filter(t => t.status === 'done').length;

          return (
            <Card key={member.id} className="glass-card hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{member.email}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs font-normal">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-4 pt-2 border-t border-border text-sm">
                  <div>
                    <span className="font-semibold">{memberTasks.length}</span>
                    <span className="text-muted-foreground ml-1">tasks</span>
                  </div>
                  <div>
                    <span className="font-semibold">{done}</span>
                    <span className="text-muted-foreground ml-1">done</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
