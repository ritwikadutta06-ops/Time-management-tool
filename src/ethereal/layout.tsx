import {
  Bell,
  BrainCircuit,
  CalendarDays,
  ClipboardList,
  Hourglass,
  MessageSquareQuote,
  Search,
  Settings2,
  Sparkles,
  UserCircle2,
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PrimaryButton } from './primitives';
import { useSanctuary } from './context';
import { cn } from './utils';

const sidebarLinks = [
  { icon: CalendarDays, label: 'Planner', section: 'planner' as const, to: '/flow' },
  { icon: ClipboardList, label: 'Tasks', section: 'tasks' as const, to: '/tasks' },
  { icon: BrainCircuit, label: 'Intelligence', section: 'intelligence' as const, to: '/intelligence/feed' },
  { icon: Settings2, label: 'Settings', section: 'settings' as const, to: '/profile' },
];

const topLinks = [
  { label: 'Flow', to: '/flow' },
  { label: 'Focus', to: '/focus' },
  { label: 'Planner', to: '/tasks' },
  { label: 'Intelligence', to: '/intelligence/feed' },
  { label: 'Profile', to: '/profile' },
];

function useActiveSection() {
  const location = useLocation();

  if (location.pathname.startsWith('/tasks') || location.pathname.startsWith('/reschedule')) {
    return 'tasks';
  }

  if (location.pathname.startsWith('/intelligence')) {
    return 'intelligence';
  }

  if (location.pathname.startsWith('/profile')) {
    return 'settings';
  }

  return 'planner';
}

export function MainShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { focusScore, peakEnergyLabel } = useSanctuary();
  const activeSection = useActiveSection();

  return (
    <div className="min-h-screen bg-[var(--ethereal-background)] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto min-h-[calc(100vh-2rem)] max-w-[1520px]">
        <header className="glass-panel sticky top-4 z-50 mb-4 rounded-[2rem] px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-8">
              <span className="font-display text-2xl font-semibold tracking-tight text-[var(--ethereal-primary)]">
                TaskPilot
              </span>
              <nav className="hidden gap-2 lg:flex">
                {topLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    className={({ isActive }) =>
                      cn(
                        'rounded-full px-4 py-2 text-sm font-medium transition',
                        isActive
                          ? 'bg-white text-[var(--ethereal-primary)] shadow-[0_12px_32px_rgba(25,28,29,0.04)]'
                          : 'text-[var(--ethereal-muted)] hover:bg-[var(--ethereal-surface-soft)]',
                      )
                    }
                    to={link.to}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <label className="hidden items-center gap-2 rounded-full bg-[var(--ethereal-surface-soft)] px-4 py-2.5 text-sm text-[var(--ethereal-muted)] md:flex">
                <Search className="h-4 w-4" />
                <input
                  className="w-44 bg-transparent outline-none placeholder:text-[var(--ethereal-muted)]"
                  placeholder="Search focus"
                />
              </label>
              <button className="rounded-full p-2.5 text-[var(--ethereal-muted)] transition hover:bg-[var(--ethereal-surface-soft)]" type="button">
                <Hourglass className="h-5 w-5" />
              </button>
              <button className="rounded-full p-2.5 text-[var(--ethereal-muted)] transition hover:bg-[var(--ethereal-surface-soft)]" type="button">
                <Bell className="h-5 w-5" />
              </button>
              <NavLink
                className={cn(
                  'rounded-full p-2.5 text-[var(--ethereal-primary)] transition hover:bg-[var(--ethereal-surface-soft)]',
                  location.pathname.startsWith('/profile') && 'bg-white shadow-[0_12px_32px_rgba(25,28,29,0.04)]',
                )}
                to="/profile"
              >
                <UserCircle2 className="h-6 w-6" />
              </NavLink>
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="ethereal-sidebar hidden min-h-[calc(100vh-7rem)] flex-col rounded-[2.25rem] px-4 py-6 lg:flex">
            <div className="mb-8 px-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ethereal-muted)]">
                Focus score
              </p>
              <p className="mt-2 font-display text-5xl leading-none text-[var(--ethereal-primary)]">{focusScore}</p>
              <p className="mt-2 text-sm text-[var(--ethereal-muted)]">Peak Energy: {peakEnergyLabel}</p>
            </div>

            <nav className="space-y-2">
              {sidebarLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.section;

                return (
                  <NavLink
                    key={item.to}
                    className={cn(
                      'flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-medium transition',
                      isActive
                        ? 'bg-white text-[var(--ethereal-primary)] shadow-[0_12px_32px_rgba(25,28,29,0.04)]'
                        : 'text-[var(--ethereal-muted)] hover:bg-[rgba(255,255,255,0.6)] hover:text-[var(--ethereal-ink)]',
                    )}
                    to={item.to}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <PrimaryButton
              className="mt-8 w-full justify-center"
              onClick={() => navigate('/tasks', { state: { smartAdd: true } })}
              type="button"
            >
              <Sparkles className="h-4 w-4" />
              Smart Add Task
            </PrimaryButton>

            <div className="mt-auto px-2 pt-6">
              <a
                className="flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm text-[var(--ethereal-muted)] transition hover:bg-[rgba(255,255,255,0.6)] hover:text-[var(--ethereal-ink)]"
                href="mailto:feedback@ethereal.local"
              >
                <MessageSquareQuote className="h-4 w-4" />
                Feedback
              </a>
            </div>
          </aside>

          <main className="pb-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
