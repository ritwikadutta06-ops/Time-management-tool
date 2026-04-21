import { CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { PrimaryButton, SecondaryButton, SectionEyebrow, SurfaceCard } from '../primitives';

const filters = ['All Intelligence', 'Adaptive Proposals', 'Energy Insights', 'Daily Reports', 'System'];

const cards = [
  {
    action: 'Apply Changes',
    category: 'Adaptive Proposals',
    description:
      'I’ve noticed your cognitive load is lowest between 2:00 PM and 4:00 PM today. Should I reschedule your “Strategic Planning” session to this window?',
    title: 'Deep Work Optimization',
  },
  {
    category: 'Energy Insights',
    description:
      'Your biometric data indicates high cortisol and focus levels. This is the optimal time for creative problem-solving.',
    title: 'Peak Energy Alert',
  },
  {
    category: 'System',
    description: 'All 14 connected devices are now synchronized with your TaskPilot Neural Core.',
    title: 'Cloud Sync Complete',
  },
];

export function InsightsFeedPage() {
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  return (
    <div className="space-y-4">
      <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
        <SectionEyebrow>Personalized stream</SectionEyebrow>
        <h1 className="mt-3 font-display text-5xl leading-[0.96] text-[var(--ethereal-ink)] sm:text-6xl">
          Intelligence Feed
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--ethereal-muted)]">
          Your AI agent has synthesized your day. Review these adaptive insights and system updates to
          maintain peak flow.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                filter === activeFilter
                  ? 'bg-[var(--ethereal-primary)] text-white'
                  : 'bg-[var(--ethereal-surface-soft)] text-[var(--ethereal-muted)]'
              }`}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {cards
              .filter((card) => activeFilter === 'All Intelligence' || card.category === activeFilter)
              .map((card, index) => (
                <div
                  key={card.title}
                  className={`rounded-[2rem] px-5 py-5 ${
                    index === 0
                      ? 'bg-white shadow-[0_12px_32px_rgba(25,28,29,0.04)]'
                      : 'bg-[var(--ethereal-surface-soft)]'
                  }`}
                >
                  <SectionEyebrow>{card.category}</SectionEyebrow>
                  <h2 className="mt-3 text-2xl font-semibold text-[var(--ethereal-ink)]">{card.title}</h2>
                  <p className="mt-3 text-base leading-8 text-[var(--ethereal-muted)]">{card.description}</p>
                  {card.action ? (
                    <div className="mt-5 flex gap-3">
                      <PrimaryButton type="button">{card.action}</PrimaryButton>
                      <SecondaryButton type="button">Dismiss</SecondaryButton>
                    </div>
                  ) : null}
                </div>
              ))}
          </div>

          <div className="space-y-4">
            <div className="ethereal-report-panel">
              <SectionEyebrow>Daily report</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-semibold text-white">EOD Efficiency Summary</h2>
              <p className="mt-3 max-w-sm text-sm leading-7 text-white/78">
                You’ve regained 1.4 hours today through automated rescheduling and peak-state alignment.
                Review the full breakdown of your performance metrics.
              </p>
              <PrimaryButton className="mt-6 bg-white text-[var(--ethereal-primary)]" type="button">
                View Full Report
              </PrimaryButton>
            </div>

            <SurfaceCard className="px-5 py-5">
              <SectionEyebrow>Quick actions</SectionEyebrow>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <button className="ethereal-quick-action" type="button">
                  <Sparkles className="h-4 w-4 text-[var(--ethereal-primary)]" />
                  Activate Focus Mode
                </button>
                <button className="ethereal-quick-action" type="button">
                  <CheckCircle2 className="h-4 w-4 text-[var(--ethereal-secondary)]" />
                  Mark All as Read
                </button>
                <button className="ethereal-quick-action" type="button">
                  <Zap className="h-4 w-4 text-[var(--ethereal-tertiary)]" />
                  Tune AI Sensitivity
                </button>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
