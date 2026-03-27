import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { StartupMetric, StartupStage } from '@/lib/types';

const STAGES: StartupStage[] = ['idea', 'mvp', 'traction', 'growth', 'scale'];

const STAGE_DESCRIPTIONS: Record<StartupStage, string> = {
  idea: 'Validate problem and customer demand.',
  mvp: 'Ship core product and gather real usage.',
  traction: 'Build repeatable acquisition and retention.',
  growth: 'Scale channels, team, and operations.',
  scale: 'Optimize efficiency and expand strategically.',
};

export default function StartupProgressPage() {
  const {
    startupProgress,
    updateStartupStage,
    updateStartupFocus,
    updateStartupMetric,
  } = useApp();

  const startupProgressScore = useMemo(() => {
    if (startupProgress.metrics.length === 0) return 0;

    const score = startupProgress.metrics.reduce((sum, metric) => {
      const normalized = getMetricRatio(metric);
      return sum + normalized;
    }, 0) / startupProgress.metrics.length;

    return Math.round(score * 100);
  }, [startupProgress.metrics]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Startup Stage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={startupProgress.stage}
              onChange={e => updateStartupStage(e.target.value as StartupStage)}
            >
              {STAGES.map(stage => (
                <option key={stage} value={stage}>
                  {capitalize(stage)}
                </option>
              ))}
            </select>

            <div className="rounded-md border border-border bg-secondary/40 p-3">
              <p className="text-sm font-medium">Current focus for {capitalize(startupProgress.stage)}</p>
              <p className="text-sm text-muted-foreground mt-1">{STAGE_DESCRIPTIONS[startupProgress.stage]}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Weekly Focus</label>
              <Textarea
                value={startupProgress.weeklyFocus}
                onChange={e => updateStartupFocus(e.target.value)}
                placeholder="What is this week's top priority for startup progress?"
                className="min-h-[90px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Progress Score (Manual)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Goal attainment</span>
              <span className="font-semibold">{startupProgressScore}%</span>
            </div>
            <Progress value={startupProgressScore} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Rule-based score from KPI current values vs targets. No AI predictions or AI suggestions are used.
            </p>
            <Badge variant={startupProgressScore >= 70 ? 'default' : 'secondary'}>
              {startupProgressScore >= 70 ? 'On Track' : 'Needs Attention'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">KPI Progress Tracker (Manual Input)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {startupProgress.metrics.map(metric => {
            const metricRatio = Math.round(getMetricRatio(metric) * 100);

            return (
              <div key={metric.id} className="space-y-2 rounded-md border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-sm">{metric.name}</p>
                  <span className="text-xs text-muted-foreground">{metricRatio}% of target</span>
                </div>
                <Progress value={metricRatio} className="h-2" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Current</label>
                    <Input
                      type="number"
                      value={metric.current}
                      onChange={e => updateStartupMetric(metric.id, { current: Number(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Target ({metric.unit || 'value'})</label>
                    <Input
                      type="number"
                      value={metric.target}
                      onChange={e => updateStartupMetric(metric.id, { target: Number(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Current: {formatMetric(metric.current, metric.unit)} / Target: {formatMetric(metric.target, metric.unit)}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function getMetricRatio(metric: StartupMetric) {
  if (metric.target <= 0) return 0;

  const lowerIsBetter = /churn|burn/i.test(metric.name);
  const rawRatio = lowerIsBetter ? metric.target / Math.max(metric.current, 0.0001) : metric.current / metric.target;

  return Math.min(Math.max(rawRatio, 0), 1);
}

function formatMetric(value: number, unit: string) {
  if (unit === '$') {
    return `${unit}${Math.round(value).toLocaleString()}`;
  }

  if (unit === '%') {
    return `${value}%`;
  }

  return `${value.toLocaleString()}${unit}`;
}

function capitalize(value: string) {
  if (!value) return value;
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}
