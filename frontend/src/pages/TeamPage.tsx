import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Mail } from 'lucide-react';

export default function TeamPage() {
  const { teamMembers, tasks } = useApp();
  const [search, setSearch] = useState('');

  const filtered = teamMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
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
