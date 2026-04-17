import { formatDistanceToNow } from 'date-fns';
import { Activity, Shield } from 'lucide-react';
import { getDisplayName } from '../lib/utils';
import { useAuth } from '../providers/AuthProvider';
import { usePlanner } from '../providers/PlannerProvider';

export function AdminPage() {
  const { profile, user } = useAuth();
  const { activity, profiles } = usePlanner();

  if (profile?.role !== 'admin') {
    return (
      <div className="surface-panel px-6 py-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white">
          <Shield className="h-5 w-5" />
        </div>
        <h3 className="mt-5 font-display text-4xl text-slate-900">Admin access is restricted.</h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Promote your profile to the `admin` role in Supabase to unlock user oversight and activity reporting.
        </p>
      </div>
    );
  }

  const adminCount = profiles.filter((entry) => entry.role === 'admin').length;
  const memberCount = profiles.filter((entry) => entry.role === 'member').length;

  return (
    <div className="grid gap-4">
      <section className="surface-panel px-6 py-6">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Admin console</p>
        <h3 className="mt-2 font-display text-4xl text-slate-900">Workspace health and activity.</h3>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-[28px] bg-slate-950 px-5 py-5 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total users</p>
            <p className="mt-4 font-display text-5xl">{profiles.length}</p>
          </div>
          <div className="rounded-[28px] bg-[#f7f2e8] px-5 py-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Admins</p>
            <p className="mt-4 font-display text-5xl text-slate-950">{adminCount}</p>
          </div>
          <div className="rounded-[28px] bg-[#eef7fb] px-5 py-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Members</p>
            <p className="mt-4 font-display text-5xl text-slate-950">{memberCount}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-panel px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Profiles</p>
              <h3 className="text-2xl font-semibold text-slate-900">Team access</h3>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {profiles.map((entry) => (
              <div key={entry.id} className="rounded-[24px] bg-[#fbf8f1] px-4 py-4 ring-1 ring-slate-200/60">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {getDisplayName(entry.full_name, entry.id === user?.id ? user.email : null)}
                    </p>
                    <p className="text-sm text-slate-500">{entry.id === user?.id ? user.email : entry.id}</p>
                  </div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    {entry.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-panel px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Recent activity</p>
              <h3 className="text-2xl font-semibold text-slate-900">Audit-friendly timeline</h3>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {activity.length ? (
              activity.map((entry) => (
                <div key={entry.id} className="rounded-[24px] bg-[#fbf8f1] px-4 py-4 ring-1 ring-slate-200/60">
                  <p className="text-sm font-semibold text-slate-900">{entry.action.replaceAll('_', ' ')}</p>
                  <p className="mt-1 text-sm text-slate-500">{entry.entity_type}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                Activity appears here after task changes and comments are recorded.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
