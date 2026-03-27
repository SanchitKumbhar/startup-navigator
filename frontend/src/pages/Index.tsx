import { useState } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import AppLayout from '@/components/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import TeamPage from '@/pages/TeamPage';
import ProjectsPage from '@/pages/ProjectsPage';
import TasksPage from '@/pages/TasksPage';
import UpdatesPage from '@/pages/UpdatesPage';

type Page = 'dashboard' | 'team' | 'projects' | 'tasks' | 'updates';

const pages: Record<Page, React.ComponentType> = {
  dashboard: DashboardPage,
  team: TeamPage,
  projects: ProjectsPage,
  tasks: TasksPage,
  updates: UpdatesPage,
};

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const PageComponent = pages[currentPage];

  return (
    <AppProvider>
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        <PageComponent />
      </AppLayout>
    </AppProvider>
  );
};

export default Index;
