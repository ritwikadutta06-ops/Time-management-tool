import { CalendarDays, CheckCircle2, Sparkles, Trash2, Users } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { quickTags } from '../data';
import { useSanctuary } from '../context';
import { AvatarStack, PrimaryButton, SecondaryButton, SectionEyebrow, SurfaceCard } from '../primitives';
import { deriveIntentSuggestion } from '../utils';
import type { TaskPriority } from '../types';

export function TasksPage() {
  const { commitIntent, intents, peakEnergyLabel, removeTask, tasks, toggleTaskStatus } = useSanctuary();
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueAtInput, setDueAtInput] = useState('');
  const [addToCalendar, setAddToCalendar] = useState(true);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const suggestion = useMemo(() => deriveIntentSuggestion(title, peakEnergyLabel), [peakEnergyLabel, title]);
  const trimmedTitle = title.trim();
  const upcomingCalendarTasks = tasks
    .filter((task) => task.addToCalendar && task.dueAt)
    .sort((left, right) => new Date(left.dueAt ?? 0).getTime() - new Date(right.dueAt ?? 0).getTime())
    .slice(0, 5);

  useEffect(() => {
    if (!location.state || !(location.state as { smartAdd?: boolean }).smartAdd) {
      return;
    }

    titleInputRef.current?.focus();
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  function resetComposer() {
    setTitle('');
    setPriority('medium');
    setDueAtInput('');
    setAddToCalendar(true);
  }

  function handleCommit() {
    if (!trimmedTitle) {
      return;
    }

    commitIntent({
      addToCalendar,
      dueAt: dueAtInput ? new Date(dueAtInput).toISOString() : null,
      priority,
      title: trimmedTitle,
    });
    resetComposer();
  }

  return (
    <div className="space-y-4">
      <SurfaceCard className="px-5 py-5 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SectionEyebrow>Task management</SectionEyebrow>
              <h1 className="mt-3 font-display text-5xl leading-[0.96] text-[var(--ethereal-ink)] sm:text-6xl">
                Add Real Tasks & Calendar Slots
              </h1>
            </div>
            <span className="rounded-full bg-[rgba(58,190,249,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ethereal-primary)]">
              Live data
            </span>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_290px]">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleCommit();
              }}
            >
              <input
                className="w-full border-none bg-transparent p-0 font-display text-4xl leading-none text-[var(--ethereal-ink)] outline-none placeholder:text-[rgba(25,28,29,0.35)]"
                ref={titleInputRef}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Describe the next high-value session"
                value={title}
              />
              <div className="mt-4 h-1.5 w-44 rounded-full bg-[var(--ethereal-primary)]" />

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[var(--ethereal-muted)]">Due date & time</span>
                  <input
                    className="ethereal-input w-full"
                    onChange={(event) => setDueAtInput(event.target.value)}
                    type="datetime-local"
                    value={dueAtInput}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[var(--ethereal-muted)]">Priority</span>
                  <select
                    className="ethereal-input w-full"
                    onChange={(event) => setPriority(event.target.value as TaskPriority)}
                    value={priority}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
                <label className="flex items-center gap-3 pt-7">
                  <input
                    checked={addToCalendar}
                    className="h-4 w-4 accent-[var(--ethereal-primary)]"
                    onChange={(event) => setAddToCalendar(event.target.checked)}
                    type="checkbox"
                  />
                  <span className="text-sm font-semibold text-[var(--ethereal-muted)]">Add to calendar flow</span>
                </label>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-[2rem] bg-[rgba(58,190,249,0.14)] px-5 py-5">
                  <div className="mb-3 flex items-center gap-2 text-[var(--ethereal-primary)]">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">AI effort estimate</span>
                  </div>
                  <p className="text-4xl font-semibold text-[var(--ethereal-primary)]">{suggestion.effort}</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--ethereal-muted)]">{suggestion.summary}</p>
                </div>
                <div className="rounded-[2rem] bg-[rgba(149,213,167,0.22)] px-5 py-5">
                  <div className="mb-3 flex items-center gap-2 text-[var(--ethereal-secondary)]">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">Peak energy match</span>
                  </div>
                  <p className="text-4xl font-semibold text-[var(--ethereal-secondary)]">{suggestion.energyWindow}</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--ethereal-muted)]">Optimal cognitive load alignment.</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="ethereal-chip-card">
                  <SectionEyebrow>Deadline</SectionEyebrow>
                  <div className="mt-4 flex items-center gap-3 text-[var(--ethereal-ink)]">
                    <CalendarDays className="h-5 w-5 text-[var(--ethereal-muted)]" />
                    <span className="font-semibold">
                      {dueAtInput
                        ? new Date(dueAtInput).toLocaleString(undefined, {
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            month: 'short',
                          })
                        : 'No due date selected'}
                    </span>
                  </div>
                </div>
                <div className="ethereal-chip-card">
                  <SectionEyebrow>Priority</SectionEyebrow>
                  <p className="mt-4 font-semibold text-[var(--ethereal-tertiary)]">{suggestion.priority}</p>
                </div>
                <div className="ethereal-chip-card">
                  <SectionEyebrow>Project</SectionEyebrow>
                  <p className="mt-4 font-semibold text-[var(--ethereal-primary)]">{suggestion.project}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-[rgba(189,200,209,0.22)] pt-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <AvatarStack values={['Elena Vance', 'Sarah Reed', 'Miles Knox']} />
                  <div className="text-sm text-[var(--ethereal-muted)]">
                    Add collaborators to this focus session
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <SecondaryButton
                    onClick={resetComposer}
                    type="button"
                  >
                    Discard
                  </SecondaryButton>
                  <PrimaryButton
                    disabled={!trimmedTitle}
                    type="submit"
                  >
                    Add Task
                  </PrimaryButton>
                </div>
              </div>
            </form>

            <div className="space-y-4">
              <SurfaceCard className="bg-[rgba(248,250,251,0.78)] px-5 py-5">
                <SectionEyebrow>Quick tags</SectionEyebrow>
                <div className="mt-4 flex flex-wrap gap-2">
                  {quickTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-3 py-2 text-sm font-medium text-[var(--ethereal-muted)] shadow-[0_12px_32px_rgba(25,28,29,0.04)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </SurfaceCard>

              <SurfaceCard className="px-5 py-5">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[var(--ethereal-primary)]" />
                  <SectionEyebrow>Your tasks</SectionEyebrow>
                </div>
                <div className="mt-4 space-y-3">
                  {tasks.length ? (
                    tasks.slice(0, 6).map((task) => (
                      <div key={task.id} className="rounded-[1.5rem] bg-[var(--ethereal-surface-soft)] px-4 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className={`font-semibold ${task.status === 'done' ? 'line-through opacity-60' : 'text-[var(--ethereal-ink)]'}`}>{task.title}</p>
                            <p className="mt-1 text-sm text-[var(--ethereal-muted)]">
                              {task.dueAt
                                ? new Date(task.dueAt).toLocaleString(undefined, {
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    month: 'short',
                                  })
                                : 'No due date'}{' '}
                              · {task.priority.toUpperCase()} · {task.addToCalendar ? 'Calendar' : 'Task only'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded-full p-2 text-[var(--ethereal-secondary)] transition hover:bg-white"
                              onClick={() => toggleTaskStatus(task.id)}
                              type="button"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              className="rounded-full p-2 text-[var(--ethereal-tertiary)] transition hover:bg-white"
                              onClick={() => removeTask(task.id)}
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--ethereal-muted)]">No tasks added yet.</p>
                  )}
                </div>
              </SurfaceCard>

              <SurfaceCard className="px-5 py-5">
                <SectionEyebrow>Upcoming calendar</SectionEyebrow>
                <div className="mt-4 space-y-3">
                  {upcomingCalendarTasks.length ? (
                    upcomingCalendarTasks.map((task) => (
                      <div key={task.id} className="rounded-[1.25rem] bg-[var(--ethereal-surface-soft)] px-4 py-3">
                        <p className="font-semibold text-[var(--ethereal-ink)]">{task.title}</p>
                        <p className="mt-1 text-sm text-[var(--ethereal-muted)]">
                          {new Date(task.dueAt ?? '').toLocaleString(undefined, {
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            month: 'short',
                          })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--ethereal-muted)]">
                      Calendar is empty. Enable "Add to calendar flow" when creating a task.
                    </p>
                  )}
                </div>
              </SurfaceCard>

              <SurfaceCard className="px-5 py-5">
                <SectionEyebrow>Recent intents</SectionEyebrow>
                <div className="mt-4 space-y-3">
                  {intents.slice(0, 3).map((intent) => (
                    <div key={intent.id} className="rounded-[1.5rem] bg-[var(--ethereal-surface-soft)] px-4 py-4">
                      <p className="font-semibold text-[var(--ethereal-ink)]">{intent.title}</p>
                      <p className="mt-1 text-sm text-[var(--ethereal-muted)]">
                        {intent.energyWindow} · {intent.effort}
                      </p>
                    </div>
                  ))}
                </div>
              </SurfaceCard>
            </div>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
