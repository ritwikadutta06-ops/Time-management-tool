import { ArrowRight } from 'lucide-react';
import { focusTrend } from '../data';
import { useSanctuary } from '../context';
import { MiniBars, PrimaryButton, SectionEyebrow, SurfaceCard } from '../primitives';

export function InsightsTrendsPage() {
  const { applyAdaptiveReschedule, focusScore, overloadResolved, peakEnergyLabel } = useSanctuary();

  return (
    <div className="space-y-4">
      <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
        <SectionEyebrow>Intelligence</SectionEyebrow>
        <h1 className="mt-3 font-display text-5xl leading-[0.96] text-[var(--ethereal-ink)] sm:text-6xl">
          Workload Intelligence
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--ethereal-muted)]">
          Your cognitive resonance is up 12% this week. Keep protecting your morning deep-work windows
          around {peakEnergyLabel}.
        </p>
      </SurfaceCard>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard className="px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SectionEyebrow>Focus score trend</SectionEyebrow>
              <p className="mt-3 text-5xl font-semibold text-[var(--ethereal-ink)]">{focusScore.toFixed(1)}</p>
              <p className="mt-2 text-sm font-semibold text-[var(--ethereal-secondary)]">+4.2% this week</p>
            </div>
            <span className="rounded-full bg-[var(--ethereal-surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--ethereal-primary)]">
              Month
            </span>
          </div>
          <div className="mt-6">
            <MiniBars highlightIndex={6} values={focusTrend} />
          </div>
        </SurfaceCard>

        <SurfaceCard className="px-6 py-6">
          <SectionEyebrow>Burnout risk</SectionEyebrow>
          <div className="mt-5 flex items-center gap-4">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full"
              style={{ background: 'conic-gradient(var(--ethereal-secondary) 105deg, rgba(189,200,209,0.34) 0deg)' }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-sm font-bold text-[var(--ethereal-secondary)]">
                Low
              </div>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[var(--ethereal-ink)]">Healthy Balance</p>
              <p className="mt-1 text-sm text-[var(--ethereal-muted)]">Recovery rate is optimal.</p>
              <p className="mt-4 text-sm text-[var(--ethereal-muted)]">Primary stressor: Email overload</p>
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <SurfaceCard className="px-5 py-5">
          <SectionEyebrow>Efficiency patterns</SectionEyebrow>
          <div className="mt-4 space-y-4">
            {[
              ['Deep Work', '4.5h/day'],
              ['Collaboration', '2.2h/day'],
              ['Admin/Bio-breaks', '1.3h/day'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-[1.25rem] bg-[var(--ethereal-surface-soft)] px-4 py-4">
                <span className="font-medium text-[var(--ethereal-ink)]">{label}</span>
                <span className="text-sm font-semibold text-[var(--ethereal-muted)]">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[1.5rem] bg-[var(--ethereal-surface-soft)] px-4 py-5 text-center">
            <SectionEyebrow>Meeting load</SectionEyebrow>
            <p className="mt-3 text-5xl font-semibold text-[var(--ethereal-ink)]">12.4</p>
            <p className="mt-2 text-sm text-[var(--ethereal-muted)]">Hours per week</p>
            <div className="mt-4 h-2 rounded-full bg-white">
              <div className="h-2 w-[58%] rounded-full bg-[var(--ethereal-primary)]" />
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="ethereal-cta-panel px-6 py-6">
          <SectionEyebrow>Inefficiency alert</SectionEyebrow>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-white">
            Back-to-back meetings are reducing your deep work by 30%
          </h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/78">
            TaskPilot suggests blocking 15 minutes of &quot;Buffer Time&quot; between your Tuesday afternoon
            syncs to prevent cognitive fatigue.
          </p>
          <PrimaryButton
            className="mt-8 bg-white text-[var(--ethereal-primary)]"
            onClick={applyAdaptiveReschedule}
            type="button"
          >
            {overloadResolved ? 'Optimized schedule active' : 'Apply Optimized Schedule'}
            <ArrowRight className="h-4 w-4" />
          </PrimaryButton>

          <div className="mt-10 grid gap-5 text-sm text-white/84 sm:grid-cols-4">
            <div>
              <SectionEyebrow>Context switches</SectionEyebrow>
              <p className="mt-2 text-3xl font-semibold text-white">18</p>
              <p className="mt-1">High</p>
            </div>
            <div>
              <SectionEyebrow>Response time</SectionEyebrow>
              <p className="mt-2 text-3xl font-semibold text-white">12m</p>
              <p className="mt-1">Ideal</p>
            </div>
            <div>
              <SectionEyebrow>Digital wellness</SectionEyebrow>
              <p className="mt-2 text-3xl font-semibold text-white">92%</p>
              <p className="mt-1">Great</p>
            </div>
            <div>
              <SectionEyebrow>Peak productivity</SectionEyebrow>
              <p className="mt-2 text-3xl font-semibold text-white">10:42</p>
              <p className="mt-1">AM</p>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
