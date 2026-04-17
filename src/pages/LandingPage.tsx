import { ArrowRight, CheckCircle2, Layers3, Orbit, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const featureCards = [
  {
    description: 'Move from idea to execution with a dashboard tuned for actual decisions, not clutter.',
    icon: Orbit,
    title: 'Strategic overview',
  },
  {
    description: 'Supabase authentication and row-level policies keep every workspace scoped correctly.',
    icon: ShieldCheck,
    title: 'Secure by default',
  },
  {
    description: 'Tasks, comments, and activity stay in one focused workflow with mobile-friendly speed.',
    icon: Layers3,
    title: 'Built to ship',
  },
];

export function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
      <div className="hero-orb left-[-8rem] top-[-7rem]" />
      <div className="hero-orb hero-orb-secondary bottom-[-9rem] right-[-7rem]" />

      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-4">
        <header className="surface-panel flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-2xl leading-none text-slate-900">AI Planner</p>
              <p className="text-sm text-slate-500">React, Vite, Tailwind, Supabase</p>
            </div>
          </div>

          <Link
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            to={user ? '/app' : '/auth'}
          >
            {user ? 'Open workspace' : 'Get started'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <section className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1.08fr)_380px]">
          <div className="surface-panel relative overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
            <div className="absolute inset-x-8 top-8 h-48 rounded-full bg-[radial-gradient(circle,_rgba(54,197,240,0.18),_transparent_62%)] blur-3xl" />
            <div className="relative max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Production-ready planning experience
              </span>
              <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] text-slate-950 sm:text-6xl lg:text-7xl">
                Work planning that feels sharp, calm, and instantly usable.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                AI Planner turns the usual task dashboard into a polished operating surface for teams who need
                clarity fast. Authentication, task workflows, comments, admin visibility, and responsive layout
                are already built into the foundation.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  to={user ? '/app' : '/auth'}
                >
                  {user ? 'Go to dashboard' : 'Launch the app'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                  href="#features"
                >
                  Explore features
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[28px] bg-slate-950 px-5 py-5 text-white">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Sprint readiness</p>
                  <p className="mt-3 font-display text-4xl">87%</p>
                  <p className="mt-2 text-sm text-slate-300">Clean overview of active, overdue, and completed work.</p>
                </div>
                <div className="rounded-[28px] bg-white px-5 py-5 ring-1 ring-slate-200/70">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Security layer</p>
                  <p className="mt-3 font-display text-4xl text-slate-950">RLS</p>
                  <p className="mt-2 text-sm text-slate-600">Supabase policies keep data scoped per user or role.</p>
                </div>
                <div className="rounded-[28px] bg-[var(--color-accent-soft)] px-5 py-5 ring-1 ring-[var(--color-accent-muted)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">Responsive</p>
                  <p className="mt-3 font-display text-4xl text-slate-950">100%</p>
                  <p className="mt-2 text-sm text-slate-700">Every core screen is comfortable on desktop and mobile.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="surface-panel p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Inside the build</p>
              <div className="mt-5 space-y-4">
                {featureCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div key={card.title} className="rounded-[24px] bg-[#f6f1e6] p-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-900 ring-1 ring-slate-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{card.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="surface-panel bg-slate-950 p-6 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current stack</p>
              <div className="mt-5 grid gap-3 text-sm text-slate-300">
                <div className="rounded-2xl bg-white/8 px-4 py-3">React 19 + Vite 8</div>
                <div className="rounded-2xl bg-white/8 px-4 py-3">Tailwind CSS 4 styling system</div>
                <div className="rounded-2xl bg-white/8 px-4 py-3">Supabase Auth + Postgres-ready schema</div>
                <div className="rounded-2xl bg-white/8 px-4 py-3">Responsive, route-protected, typed frontend</div>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-panel px-6 py-8 sm:px-8" id="features">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Feature summary</p>
              <h2 className="mt-3 font-display text-4xl text-slate-900">Everything needed for a clean first release.</h2>
            </div>
            <div className="rounded-[28px] bg-[#f7f2e8] p-6">
              <p className="text-lg font-semibold text-slate-900">Authentication flow</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Email signup, login, logout, session-aware routing, and graceful loading states.
              </p>
            </div>
            <div className="rounded-[28px] bg-[#eef7fb] p-6">
              <p className="text-lg font-semibold text-slate-900">Task operations</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Create, edit, archive, filter, comment, and monitor progress in one workflow.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
