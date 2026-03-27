import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, KeyRound, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { setAuthUser } from '@/lib/auth';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = useMemo<AuthMode>(() => {
    const value = searchParams.get('mode');
    return value === 'register' ? 'register' : 'login';
  }, [searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const submitLabel = mode === 'register' ? 'Create account' : 'Sign in';

  const switchMode = (next: AuthMode) => {
    setError('');
    setSearchParams({ mode: next });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const finalName = email.split('@')[0] || 'Team Member';
    setAuthUser({
      name: finalName,
      email: email.trim(),
    });

    navigate('/app');
  };

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden h-full overflow-hidden border-r border-border bg-sidebar text-sidebar-foreground lg:flex lg:items-center lg:justify-center">
          <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />

          <div className="relative z-10 w-full max-w-sm px-8 py-6 xl:max-w-md">
            <Badge className="bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent">Wostup Access</Badge>
            <h1 className="mt-4 max-w-sm text-2xl font-bold leading-tight">Secure your workspace before you ship.</h1>
            <p className="mt-3 max-w-sm text-xs text-sidebar-foreground/80">
              Access to the project dashboard is protected by login and registration. This keeps your team updates, tasks, and plans private.
            </p>

            <div className="mt-5 space-y-2">
              <AuthFeature icon={BadgeCheck} title="Role-ready workspace" description="Team context opens right after authentication." />
              <AuthFeature icon={Mail} title="Simple account setup" description="Register in seconds with your team email." />
              <AuthFeature icon={KeyRound} title="Protected access" description="Only authenticated users can enter /app." />
            </div>

            <div className="mt-5 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-2.5">
              <p className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground/70">Flow</p>
              <p className="mt-1 text-xs">Home</p>
              <p className="text-xs">Authentication</p>
              <p className="text-xs">Workspace</p>
            </div>
          </div>
        </section>

        <section className="flex h-full items-center justify-center overflow-hidden px-6 py-6 md:px-8">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
            <Link to="/" className="mb-2 inline-flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>

            <div className="mb-2 flex items-center justify-between">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Team Access</Badge>
              <p className="text-[11px] text-muted-foreground">Protected route: /app</p>
            </div>

            <h2 className="text-lg font-bold">{mode === 'register' ? 'Create your account' : 'Welcome back'}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {mode === 'register'
                ? 'Create an account to continue into your Wostup workspace.'
                : 'Sign in to continue into your Wostup workspace.'}
            </p>

            <div className="mb-2 mt-2 flex items-center gap-1.5 rounded-lg bg-secondary p-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  mode === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  mode === 'register' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="h-8 pl-9"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@wostup.io"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs">Password</Label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="h-8 pl-9"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs">Confirm password</Label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="h-8 pl-9"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Repeat password"
                    />
                  </div>
                </div>
              )}

              {error && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

              <Button type="submit" className="h-9 w-full">{submitLabel}</Button>
            </form>

            <p className="mt-2 text-[11px] text-muted-foreground">
              By continuing, you agree to our platform access policy and workspace terms.
            </p>

            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Need to switch pages quickly?{' '}
              <Link to={mode === 'register' ? '/auth?mode=login' : '/auth?mode=register'} className="text-primary hover:underline">
                {mode === 'register' ? 'Go to login' : 'Go to register'}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function AuthFeature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-2.5">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <p className="text-xs font-semibold">{title}</p>
      </div>
      <p className="mt-1 text-[11px] text-sidebar-foreground/80">{description}</p>
    </div>
  );
}










