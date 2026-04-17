import { isPast, isToday } from 'date-fns';
import { ArrowRight, CheckCircle2, Clock3, Flag, ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dueTone, formatDueDate, priorityLabelMap, priorityToneMap, statusLabelMap, statusToneMap } from '../lib/utils';
import { usePlanner } from '../providers/PlannerProvider';

export function DashboardPage() {
  const { loading, tasks } = usePlanner();

  const activeTasks = tasks.filter((task) => task.status !== 'done' && !task.is_archived);
  const completedTasks = tasks.filter((task) => task.status === 'done' && !task.is_archived);
  const overdueTasks = activeTasks.filter((task) => {
    if (!task.due_date) {
      return false;
    }

    const date = new Date(task.due_date);
    return isPast(date) && !isToday(date);
  });
  const highPriorityTasks = activeTasks.filter((task) => task.priority === 'high');
  const nextUp = [...activeTasks]
    .sort((left, right) => {
      if (!left.due_date) {
        return 1;
      }

      if (!right.due_date) {
        return -1;
      }

      return new Date(left.due_date).getTime() - new Date(right.due_date).getTime();
    })
    .slice(0, 4);

  const statusBuckets = [
    { key: 'todo', tasks: tasks.filter((task) => task.status === 'todo') },
    { key: 'in_progress', tasks: tasks.filter((task) => task.status === 'in_progress') },
    { key: 'done', tasks: tasks.filter((task) => task.status === 'done') },
  ] as const;

  return (
    <div className="grid gap-4">
      <section className="surface-panel overflow-hidden px-5 py-6 sm:px-7">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Overview</p>
            <h3 className="mt-3 max-w-2xl font-display text-4xl text-slate-900">
              Your current planning surface is built for focus, not noise.
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Review active work, spot overdue tasks, and jump straight into the next most important move.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                to="/app/tasks"
              >
                Open task board
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600">
                {loading ? 'Loading tasks...' : `${tasks.length} tasks currently visible`}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[28px] bg-slate-950 px-5 py-5 text-white">
              <ListTodo className="h-5 w-5 text-slate-300" />
              <p className="mt-8 text-xs uppercase tracking-[0.24em] text-slate-400">Active tasks</p>
              <p className="mt-2 font-display text-5xl">{activeTasks.length}</p>
            </div>
            <div className="rounded-[28px] bg-[#f7f2e8] px-5 py-5">
              <Clock3 className="h-5 w-5 text-slate-700" />
              <p className="mt-8 text-xs uppercase tracking-[0.24em] text-slate-500">Overdue</p>
              <p className="mt-2 font-display text-5xl text-slate-950">{overdueTasks.length}</p>
            </div>
            <div className="rounded-[28px] bg-[#eef7fb] px-5 py-5">
              <Flag className="h-5 w-5 text-slate-700" />
              <p className="mt-8 text-xs uppercase tracking-[0.24em] text-slate-500">High priority</p>
              <p className="mt-2 font-display text-5xl text-slate-950">{highPriorityTasks.length}</p>
            </div>
            <div className="rounded-[28px] bg-[var(--color-accent-soft)] px-5 py-5">
              <CheckCircle2 className="h-5 w-5 text-slate-700" />
              <p className="mt-8 text-xs uppercase tracking-[0.24em] text-slate-500">Completed</p>
              <p className="mt-2 font-display text-5xl text-slate-950">{completedTasks.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-panel px-5 py-6 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Next up</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">Closest deadlines</h3>
            </div>
            <Link className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline" to="/app/tasks">
              See all
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {nextUp.length ? (
              nextUp.map((task) => (
                <div key={task.id} className="rounded-[24px] bg-[#fbf8f1] px-4 py-4 ring-1 ring-slate-200/60">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusToneMap[task.status]}`}>
                      {statusLabelMap[task.status]}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityToneMap[task.priority]}`}>
                      {priorityLabelMap[task.priority]}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-slate-900">{task.title}</p>
                  <p className={`mt-2 text-sm ${dueTone(task.due_date, task.status)}`}>{formatDueDate(task.due_date)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                Add a task to start building your upcoming queue.
              </div>
            )}
          </div>
        </div>

        <div className="surface-panel px-5 py-6 sm:px-6">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Status map</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Flow by stage</h3>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {statusBuckets.map((bucket) => (
              <div key={bucket.key} className="rounded-[24px] bg-[#fbf8f1] p-4 ring-1 ring-slate-200/60">
                <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusToneMap[bucket.key]}`}>
                  {statusLabelMap[bucket.key]}
                </div>
                <p className="mt-4 font-display text-4xl text-slate-950">{bucket.tasks.length}</p>
                <div className="mt-4 space-y-2">
                  {bucket.tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="rounded-2xl bg-white px-3 py-3 text-sm text-slate-600">
                      {task.title}
                    </div>
                  ))}
                  {!bucket.tasks.length ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-3 py-3 text-sm text-slate-400">
                      Nothing here yet.
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
