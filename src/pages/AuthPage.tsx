import { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { hasSupabaseEnv } from '../lib/env';
import { useAuth } from '../providers/AuthProvider';

type AuthMode = 'signin' | 'signup';

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/app';

  const [mode, setMode] = useState<AuthMode>('signin');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  });
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    fullName: '',
    password: '',
  });

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
      <div className="hero-orb left-[-8rem] top-[-7rem]" />
      <div className="hero-orb hero-orb-secondary bottom-[-9rem] right-[-7rem]" />

      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl gap-4 lg:grid-cols-[1.05fr_480px]">
        <section className="surface-panel hidden p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-slate-500">AI Planner</p>
            <h1 className="mt-5 font-display text-6xl leading-[0.92] text-slate-950">
              Focused execution for product teams with zero dashboard chaos.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Sign in to manage tasks, track priorities, and keep every comment anchored to the work itself.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] bg-slate-950 px-6 py-6 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">What is already built</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>Protected routing with session handling</p>
                <p>Task CRUD with comments and activity traces</p>
                <p>Responsive Tailwind interface with admin visibility</p>
              </div>
            </div>
            <div className="rounded-[28px] bg-[#eef7fb] px-6 py-6">
              <p className="text-sm font-semibold text-slate-900">Supabase ready</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                The frontend connects with your configured project and gracefully falls back to local preview mode
                if planner tables are not available yet.
              </p>
            </div>
          </div>
        </section>

        <section className="surface-panel flex items-center p-6 sm:p-8">
          <div className="w-full">
            <div className="flex rounded-full bg-slate-100 p-1">
              <button
                className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setNotice(null);
                }}
                type="button"
              >
                Sign in
              </button>
              <button
                className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setNotice(null);
                }}
                type="button"
              >
                Create account
              </button>
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                {mode === 'signin' ? 'Welcome back' : 'Create your workspace'}
              </p>
              <h2 className="mt-3 font-display text-4xl text-slate-950">
                {mode === 'signin' ? 'Pick up exactly where you left off.' : 'Launch a secure planning workspace.'}
              </h2>
            </div>

            {!hasSupabaseEnv ? (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Supabase environment variables are missing. Add them to `.env.local` to enable authentication.
              </div>
            ) : null}

            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {notice ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {notice}
              </div>
            ) : null}

            {mode === 'signin' ? (
              <form
                className="mt-8 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setPending(true);
                  setError(null);
                  setNotice(null);

                  void signIn(signInForm.email, signInForm.password)
                    .then(() => navigate(redirectTo, { replace: true }))
                    .catch((cause: unknown) =>
                      setError(cause instanceof Error ? cause.message : 'Unable to sign in.'),
                    )
                    .finally(() => setPending(false));
                }}
              >
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <input
                      className="min-w-0 flex-1 bg-transparent text-slate-900 outline-none"
                      onChange={(event) =>
                        setSignInForm((current) => ({ ...current, email: event.target.value }))
                      }
                      placeholder="you@company.com"
                      required
                      type="email"
                      value={signInForm.email}
                    />
                  </div>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">Password</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <LockKeyhole className="h-4 w-4 text-slate-400" />
                    <input
                      className="min-w-0 flex-1 bg-transparent text-slate-900 outline-none"
                      onChange={(event) =>
                        setSignInForm((current) => ({ ...current, password: event.target.value }))
                      }
                      placeholder="Enter your password"
                      required
                      type="password"
                      value={signInForm.password}
                    />
                  </div>
                </label>

                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  disabled={pending}
                  type="submit"
                >
                  {pending ? 'Signing in...' : 'Sign in'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <form
                className="mt-8 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setPending(true);
                  setError(null);
                  setNotice(null);

                  void signUp(signUpForm.fullName, signUpForm.email, signUpForm.password)
                    .then((result) => {
                      if (result.needsEmailConfirmation) {
                        setNotice('Check your inbox to confirm your email, then sign in.');
                        setMode('signin');
                        return;
                      }

                      navigate('/app', { replace: true });
                    })
                    .catch((cause: unknown) =>
                      setError(cause instanceof Error ? cause.message : 'Unable to create account.'),
                    )
                    .finally(() => setPending(false));
                }}
              >
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">Full name</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <UserRound className="h-4 w-4 text-slate-400" />
                    <input
                      className="min-w-0 flex-1 bg-transparent text-slate-900 outline-none"
                      onChange={(event) =>
                        setSignUpForm((current) => ({ ...current, fullName: event.target.value }))
                      }
                      placeholder="Alex Carter"
                      required
                      value={signUpForm.fullName}
                    />
                  </div>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <input
                      className="min-w-0 flex-1 bg-transparent text-slate-900 outline-none"
                      onChange={(event) =>
                        setSignUpForm((current) => ({ ...current, email: event.target.value }))
                      }
                      placeholder="you@company.com"
                      required
                      type="email"
                      value={signUpForm.email}
                    />
                  </div>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">Password</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <LockKeyhole className="h-4 w-4 text-slate-400" />
                    <input
                      className="min-w-0 flex-1 bg-transparent text-slate-900 outline-none"
                      minLength={8}
                      onChange={(event) =>
                        setSignUpForm((current) => ({ ...current, password: event.target.value }))
                      }
                      placeholder="At least 8 characters"
                      required
                      type="password"
                      value={signUpForm.password}
                    />
                  </div>
                </label>

                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  disabled={pending}
                  type="submit"
                >
                  {pending ? 'Creating account...' : 'Create account'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
