import { CalendarDays, Sparkles, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { quickTags } from '../data';
import { useSanctuary } from '../context';
import { AvatarStack, PrimaryButton, SecondaryButton, SectionEyebrow, SurfaceCard } from '../primitives';
import { deriveIntentSuggestion } from '../utils';

export function TasksPage() {
  const { commitIntent, intents, peakEnergyLabel } = useSanctuary();
  const [title, setTitle] = useState(intents[0]?.title ?? 'Brand Identity Workshop');
  const suggestion = useMemo(() => deriveIntentSuggestion(title, peakEnergyLabel), [peakEnergyLabel, title]);

  return (
    <div className="space-y-4">
      <SurfaceCard className="px-5 py-5 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SectionEyebrow>New intent</SectionEyebrow>
              <h1 className="mt-3 font-display text-5xl leading-[0.96] text-[var(--ethereal-ink)] sm:text-6xl">
                What are we focusing on?
              </h1>
            </div>
            <button className="rounded-full p-2 text-[var(--ethereal-muted)] transition hover:bg-[var(--ethereal-surface-soft)]" type="button">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_290px]">
            <div>
              <input
                className="w-full border-none bg-transparent p-0 font-display text-4xl leading-none text-[var(--ethereal-ink)] outline-none placeholder:text-[rgba(25,28,29,0.35)]"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Describe the next high-value session"
                value={title}
              />
              <div className="mt-4 h-1.5 w-44 rounded-full bg-[var(--ethereal-primary)]" />

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
                    <span className="font-semibold">Tomorrow, 5:00 PM</span>
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
                  <SecondaryButton type="button">Discard</SecondaryButton>
                  <PrimaryButton
                    onClick={() => commitIntent(title)}
                    type="button"
                  >
                    Commit to Calendar
                  </PrimaryButton>
                </div>
              </div>
            </div>

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
                  <SectionEyebrow>Recent intents</SectionEyebrow>
                </div>
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
