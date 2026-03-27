import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  LayoutDashboard, Users, FolderKanban, CheckSquare, Megaphone, Bell, ChevronLeft, ChevronRight, Moon, Sun, Menu, X, TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Page = 'dashboard' | 'startup' | 'team' | 'projects' | 'tasks' | 'updates';

interface AppLayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'startup', label: 'Startup Progress', icon: TrendingUp },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'updates', label: 'Updates', icon: Megaphone },
];

export default function AppLayout({ currentPage, onNavigate, children }: AppLayoutProps) {
  const { notifications } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 shrink-0 z-50",
        collapsed ? "w-16" : "w-60",
        "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:w-60",
        mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
      )}>
        <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
          {!collapsed && (
            <span className="font-bold text-lg text-sidebar-primary-foreground tracking-tight">
              Wostup
            </span>
          )}
          {collapsed && <span className="text-primary font-bold text-lg mx-auto">W</span>}
          <button onClick={() => setMobileOpen(false)} className="ml-auto md:hidden text-sidebar-muted hover:text-sidebar-accent-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
                currentPage === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-sidebar-border">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(!dark)}
            className={cn(
              "flex items-center gap-3 w-full px-5 py-3 text-sm text-sidebar-muted hover:text-sidebar-accent-foreground transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            {dark ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
            {!collapsed && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-full py-3 border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-accent-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-14 px-4 md:px-6 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-1.5 rounded-md hover:bg-secondary transition-colors">
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>
            <h1 className="text-lg font-semibold capitalize">{currentPage}</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-md hover:bg-secondary transition-colors"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <NotificationPanel onClose={() => setShowNotifs(false)} />
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationRead } = useApp();

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 animate-fade-in">
        <div className="p-3 border-b border-border">
          <span className="font-semibold text-sm">Notifications</span>
        </div>
        <div className="max-h-64 overflow-auto">
          {notifications.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
          )}
          {notifications.map(n => (
            <button
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={cn(
                "w-full text-left px-4 py-3 text-sm border-b border-border last:border-0 hover:bg-secondary/50 transition-colors",
                !n.read && "bg-primary/5"
              )}
            >
              <p className={cn("text-sm", !n.read && "font-medium")}>{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(n.timestamp).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
