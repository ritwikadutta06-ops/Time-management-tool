import { Clock3, Dot, Link2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { meetingDensity } from '../data';
import { useSanctuary } from '../context';
import { SectionEyebrow, StatPill, SurfaceCard } from '../primitives';
import { cn } from '../utils';

export function FlowPage() {
  const { activeFlow, overloadResolved, peakEnergyLabel, pending, realismGauge } = useSanctuary();

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_360px]">
      <section className="space-y-4">
        <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <SectionEyebrow>Daily focus dashboard</SectionEyebrow>
              <h1 className="mt-3 font-display text-5xl leading-[0.96] text-[var(--ethereal-ink)] sm:text-6xl">
                Today&apos;s Flow
              </h1>
              <p className="mt-4 text-lg text-[var(--ethereal-muted)]">
                Tuesday, May 14th. Intentional productivity only. Peak energy is protected between{' '}
                <span className="font-semibold text-[var(--ethereal-primary)]">{peakEnergyLabel}</span>.
              </p>
            </div>

            <div className="glass-panel flex min-w-[320px] items-center gap-5 rounded-[2rem] px-5 py-5">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(var(--ethereal-secondary) ${realismGauge * 3.6}deg, rgba(189,200,209,0.35) 0deg)`,
                }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-sm font-bold text-[var(--ethereal-secondary)]">
                  {realismGauge}%
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--ethereal-secondary)]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ethereal-secondary)]">
                    Realism gauge
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-[var(--ethereal-ink)]">
                  {overloadResolved ? 'Adaptive plan applied' : 'Realistic plan'}
                </h2>
                <p className="mt-1 text-sm text-[var(--ethereal-muted)]">
                  {overloadResolved
                    ? 'You now have 3.1h of protected buffer.'
                    : 'You have 2.5h of buffer remaining.'}
                </p>
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="mb-5 flex items-center justify-between">
            <SectionEyebrow>Schedule blocks</SectionEyebrow>
            <StatPill tone="primary">AI suggested</StatPill>
          </div>

          <div className="space-y-4">
            {activeFlow.map((block, index) => (
              <div key={block.id} className="relative pl-7">
                {index !== activeFlow.length - 1 ? (
                  <div className="absolute left-2 top-8 h-[calc(100%+1rem)] w-px bg-[rgba(58,190,249,0.28)]" />
                ) : null}
                <div
                  className="absolute left-0 top-6 h-4 w-4 rounded-full bg-white"
                  style={{ boxShadow: `inset 0 0 0 4px ${block.accent}` }}
                />
                <div
                  className={cn(
                    'rounded-[2rem] bg-white px-5 py-5 shadow-[0_12px_32px_rgba(25,28,29,0.04)]',
                    block.tone === 'focus' && 'translate-x-1',
                  )}
                  style={{ boxShadow: `inset 4px 0 0 ${block.accent}, 0px 12px 32px rgba(25,28,29,0.04)` }}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-xl">
                      {block.label ? <StatPill tone={block.tone === 'focus' ? 'secondary' : 'primary'}>{block.label}</StatPill> : null}
                      <h3 className="mt-3 text-2xl font-semibold text-[var(--ethereal-ink)]">{block.title}</h3>
                      <p className="mt-1 text-sm text-[var(--ethereal-muted)]">
                        {block.timeLabel}
                        {block.description ? ` (${block.description})` : ''}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {block.meta.map((item) => (
                          <StatPill key={item}>{item}</StatPill>
                        ))}
                        {block.note ? <StatPill tone="warning">AI note</StatPill> : null}
                      </div>
                      {block.note ? (
                        <p className="mt-4 rounded-[1rem] bg-[var(--ethereal-surface-soft)] px-4 py-3 text-sm italic text-[var(--ethereal-muted)]">
                          {block.note}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-[var(--ethereal-muted)]">
                      {block.participants ? (
                        <div className="flex items-center gap-2 rounded-full bg-[var(--ethereal-surface-soft)] px-3 py-2">
                          <Sparkles className="h-4 w-4 text-[var(--ethereal-primary)]" />
                          +{block.participants}
                        </div>
                      ) : null}
                      {block.meta.includes('3 Resources') ? (
                        <Link
                          className="inline-flex items-center gap-2 rounded-full bg-[var(--ethereal-surface-soft)] px-3 py-2 transition hover:bg-white"
                          to="/focus"
                        >
                          <Link2 className="h-4 w-4" />
                          Open focus mode
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </section>

      <aside className="space-y-4">
        <SurfaceCard className="px-5 py-5">
          <SectionEyebrow>Meeting density</SectionEyebrow>
          <div className="mt-4 flex h-36 items-end gap-3 rounded-[1.75rem] bg-[var(--ethereal-surface-soft)] px-4 py-4">
            {meetingDensity.map((value, index) => (
              <div
                key={`${value}-${index}`}
                className={cn(
                  'flex-1 rounded-[1rem]',
                  index === 2 || index === 3 ? 'bg-[var(--ethereal-primary)]' : 'bg-[rgba(189,200,209,0.42)]',
                )}
                style={{ height: `${Math.max(16, value * 100)}%` }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ethereal-muted)]">
            <span>9AM</span>
            <span>12PM</span>
            <span>3PM</span>
            <span>6PM</span>
          </div>
          <p className="mt-4 text-sm text-[var(--ethereal-muted)]">Congested 2PM-4PM. AI suggests blocking 4:30PM for admin.</p>
        </SurfaceCard>

        <SurfaceCard className="px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <SectionEyebrow>Pending tasks</SectionEyebrow>
            <Link className="text-sm font-semibold text-[var(--ethereal-primary)]" to="/tasks">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {pending.map((task) => (
              <div
                key={task.id}
                className={cn(
                  'rounded-[1.5rem] px-4 py-4',
                  task.priority.includes('critical')
                    ? 'bg-[rgba(206,174,101,0.18)] text-[var(--ethereal-tertiary)]'
                    : 'bg-[var(--ethereal-surface-soft)] text-[var(--ethereal-ink)]',
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 rounded-full bg-white" />
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="mt-1 text-sm opacity-75">{task.due}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="px-5 py-5">
          <SectionEyebrow>AI recommendation</SectionEyebrow>
          <div className="mt-4 rounded-[1.75rem] bg-[rgba(58,190,249,0.12)] px-5 py-5">
            <div className="mb-3 flex items-center gap-2 text-[var(--ethereal-primary)]">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Adaptive insight</span>
            </div>
            <p className="text-base leading-7 text-[var(--ethereal-ink)]">
              Your energy usually dips at 3:45 PM. I&apos;ve scheduled a 15-minute nature walk to reset.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="text-sm font-semibold text-[var(--ethereal-primary)]" to="/focus">
                Enter focus mode
              </Link>
              <span className="inline-flex items-center gap-1 text-sm text-[var(--ethereal-muted)]">
                <Clock3 className="h-4 w-4" />
                15 min reset
              </span>
            </div>
          </div>
          {!overloadResolved ? (
            <Link
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ethereal-primary)]"
              to="/reschedule"
            >
              <Dot className="h-5 w-5" />
              Schedule overload detected. Review adaptive proposal
            </Link>
          ) : null}
        </SurfaceCard>
      </aside>
    </div>
  );
}
