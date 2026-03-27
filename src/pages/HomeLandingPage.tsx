import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Layers3,
  MessageSquareText,
  Rocket,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isAuthenticated } from '@/lib/auth';

export default function HomeLandingPage() {
  const navigate = useNavigate();
  const authed = isAuthenticated();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute -top-28 -left-16 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-24 right-0 h-72 w-72 rounded-full bg-info/15 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-14 md:px-10 md:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge className="mb-5 w-fit bg-primary/10 text-primary hover:bg-primary/10">Wostup Platform</Badge>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
              Run your team with focus, not a chaotic group chat.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              One place for goals, execution, updates, and momentum. Replace fragmented status checks with a shared operating rhythm that helps teams ship consistently.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button onClick={() => navigate(authed ? '/app' : '/auth')} size="lg" className="gap-2">
                {authed ? 'Open Workspace' : 'Start Free'}
                <ArrowRight className="h-4 w-4" />
              </Button>
              {!authed && (
                <Button variant="outline" size="lg" onClick={() => navigate('/auth?mode=register')}>
                  Create Account
                </Button>
              )}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricTile label="Teams" value="120+" />
              <MetricTile label="Tasks Tracked" value="30K" />
              <MetricTile label="Sprint Cadence" value="Weekly" />
              <MetricTile label="On-Time Delivery" value="92%" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur">
            <div className="space-y-3 rounded-xl border border-border bg-background/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Today at a glance</p>
                <Badge variant="secondary">Live</Badge>
              </div>
              <ProgressItem label="Milestone completion" value={78} />
              <ProgressItem label="Sprint tasks done" value={64} />
              <ProgressItem label="Team participation" value={89} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <QuickStat icon={CalendarCheck2} title="4 milestones" subtitle="due this week" />
              <QuickStat icon={MessageSquareText} title="16 updates" subtitle="posted today" />
              <QuickStat icon={Clock3} title="2 blockers" subtitle="need attention" />
              <QuickStat icon={CheckCircle2} title="27 completed" subtitle="since Monday" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">Trusted workflow for early-stage teams</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm text-muted-foreground sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card py-3">Product</div>
          <div className="rounded-lg border border-border bg-card py-3">Engineering</div>
          <div className="rounded-lg border border-border bg-card py-3">Marketing</div>
          <div className="rounded-lg border border-border bg-card py-3">Operations</div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10 md:px-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Everything needed to run Wostup in one flow</h2>
            <p className="mt-2 text-sm text-muted-foreground">From planning to updates, each module is designed to keep context and momentum visible.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={Rocket} title="Launch Planning" description="Map projects, owners, milestones, and scope before each sprint starts." />
          <FeatureCard icon={Users} title="Team Visibility" description="Know who is responsible for what and spot workload imbalance quickly." />
          <FeatureCard icon={Layers3} title="Project Layers" description="Link work from high-level initiatives down to task-level execution." />
          <FeatureCard icon={BarChart3} title="Progress Intelligence" description="Track progress trends and completion health in real time." />
          <FeatureCard icon={MessageSquareText} title="Update Stream" description="Keep announcements, milestones, and progress notes in one shared feed." />
          <FeatureCard icon={ShieldCheck} title="Secure Access" description="Use login and registration gates before opening private team workspaces." />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10 md:px-10">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <h3 className="text-xl font-bold md:text-2xl">How the flow works</h3>
          <p className="mt-2 text-sm text-muted-foreground">Simple entry path with a clear handoff into your active workspace.</p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <StepCard index="01" title="Explore Home" description="Read features, review capability blocks, and understand team value." />
            <StepCard index="02" title="Login or Register" description="Authenticate your identity to unlock workspace access." />
            <StepCard index="03" title="Enter Workspace" description="Move into your current project dashboard and start execution." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14 md:px-10">
        <div className="rounded-2xl border border-border bg-sidebar p-6 text-sidebar-foreground md:p-8">
          <h3 className="text-2xl font-bold">Ready to bring structure to your Wostup execution?</h3>
          <p className="mt-2 max-w-2xl text-sm text-sidebar-foreground/80">
            Move from ad-hoc tracking to a focused operating workflow where everyone understands priorities, status, and next steps.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => navigate(authed ? '/app' : '/auth')} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {authed ? 'Go to App' : 'Login to Continue'}
            </Button>
            {!authed && (
              <Button variant="outline" onClick={() => navigate('/auth?mode=register')} className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent">
                Register Account
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/80 px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function ProgressItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function QuickStat({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/60 p-3">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card rounded-xl p-5 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({ index, title, description }: { index: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/70 p-4">
      <p className="text-xs font-semibold tracking-wide text-primary">{index}</p>
      <h4 className="mt-2 text-base font-semibold">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
