import {
  ArrowUpRight,
  CalendarRange,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { cn, getDisplayName, getInitials } from '../lib/utils';
import { useAuth } from '../providers/AuthProvider';
import { usePlanner } from '../providers/PlannerProvider';

const navigation = [
  { icon: LayoutDashboard, label: 'Overview', to: '/app' },
  { icon: CalendarRange, label: 'Tasks', to: '/app/tasks' },
  { icon: ShieldCheck, label: 'Admin', to: '/app/admin' },
];

export function AppShell() {
  const { profile, signOut, user } = useAuth();
  const { dataMode, error, refreshing } = usePlanner();

  const displayName = getDisplayName(profile?.full_name, user?.email);

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="surface-panel flex flex-col gap-8 p-5 lg:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                <Sparkles className="h-3.5 w-3.5" />
                AI Planner
              </div>
              <h1 className="mt-4 font-display text-3xl leading-none text-slate-900">
                Plan work that keeps its shape.
              </h1>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
              {getInitials(profile?.full_name, user?.email)}
            </div>
          </div>

          <div className="rounded-[28px] bg-slate-950 px-5 py-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.3)]">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace health</p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">{dataMode === 'supabase' ? 'Live' : 'Preview'}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {dataMode === 'supabase'
                    ? 'Supabase sync is active.'
                    : 'Local fallback is keeping the experience available.'}
                </p>
              </div>
              <ArrowUpRight className="h-10 w-10 rounded-2xl bg-white/10 p-2" />
            </div>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const disabled = item.to === '/app/admin' && profile?.role !== 'admin';

              return (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition',
                      disabled && 'pointer-events-none opacity-40',
                      isActive
                        ? 'bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.2)]'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900',
                    )
                  }
                  to={item.to}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.to === '/app/admin' && profile?.role !== 'admin' ? (
                    <span className="text-[11px] uppercase tracking-[0.18em]">Locked</span>
                  ) : null}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4 rounded-[28px] bg-white/80 p-5 ring-1 ring-white/80">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Signed in as</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{displayName}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={() => void signOut()}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="space-y-4">
          <header className="surface-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {refreshing ? 'Refreshing your latest plan...' : 'Production-ready planning dashboard'}
              </p>
              <h2 className="mt-1 font-display text-3xl text-slate-900">Keep every sprint visible.</h2>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]',
                  dataMode === 'supabase'
                    ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                    : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
                )}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {dataMode === 'supabase' ? 'Supabase live' : 'Local preview'}
              </span>
            </div>
          </header>

          {error ? (
            <div className="surface-panel border border-rose-200 bg-rose-50/80 px-5 py-4 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <Outlet />
        </main>
      </div>
    </div>
  );
}
