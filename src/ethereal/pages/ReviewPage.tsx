import { useState } from 'react';
import { intensityFlow, reportMomentum } from '../data';
import { MiniBars, PrimaryButton, SecondaryButton, SectionEyebrow, SurfaceCard } from '../primitives';

export function ReviewPage() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="space-y-4">
      <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
        <SectionEyebrow>Performance</SectionEyebrow>
        <h1 className="mt-3 font-display text-5xl leading-[0.96] text-[var(--ethereal-ink)] sm:text-6xl">
          Daily Sanctuary Report
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--ethereal-muted)]">
          Reflection on June 14. You moved with intent today. Let&apos;s look at the rhythm of your
          productivity.
        </p>
      </SurfaceCard>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <SurfaceCard className="px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <SectionEyebrow>High performance</SectionEyebrow>
              <h2 className="mt-3 text-4xl font-semibold text-[var(--ethereal-ink)]">Focus Momentum</h2>
            </div>
            <div className="text-right">
              <p className="text-5xl font-semibold text-[var(--ethereal-primary)]">85</p>
              <p className="text-sm font-semibold text-[var(--ethereal-secondary)]">+12% vs yesterday</p>
            </div>
          </div>
          <div className="mt-6">
            <MiniBars highlightIndex={5} values={reportMomentum} />
          </div>
        </SurfaceCard>

        <div className="grid gap-4">
          <SurfaceCard className="rounded-[2rem] bg-[rgba(58,190,249,0.16)] px-6 py-6">
            <SectionEyebrow>Morning spark</SectionEyebrow>
            <p className="mt-4 max-w-sm text-2xl font-semibold text-[var(--ethereal-ink)]">
              You are 20% more productive before 11:00 AM.
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--ethereal-muted)]">
              Consider moving high-cognitive tasks earlier.
            </p>
          </SurfaceCard>

          <div className="grid gap-4 md:grid-cols-2">
            <SurfaceCard className="px-5 py-5">
              <SectionEyebrow>Cognitive drag</SectionEyebrow>
              <div className="mt-4 space-y-4">
                {[
                  ['Unplanned Meetings', '42 mins lost'],
                  ['Digital Noise', '18 mins lost'],
                  ['Energy Recovery', 'Optimal break'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.25rem] bg-[var(--ethereal-surface-soft)] px-4 py-4">
                    <p className="font-medium text-[var(--ethereal-ink)]">{label}</p>
                    <p className="mt-1 text-sm text-[var(--ethereal-muted)]">{value}</p>
                  </div>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard className="px-5 py-5">
              <SectionEyebrow>Intensity flow</SectionEyebrow>
              <div className="mt-4">
                <MiniBars highlightIndex={3} values={intensityFlow} />
              </div>
            </SurfaceCard>
          </div>
        </div>
      </div>

      <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <SectionEyebrow>Tomorrow</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--ethereal-ink)]">Ready for tomorrow?</h2>
            <p className="mt-2 text-base text-[var(--ethereal-muted)]">
              TaskPilot has drafted your morning schedule based on today&apos;s peaks.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <SecondaryButton type="button">Review Plan</SecondaryButton>
            <PrimaryButton onClick={() => setConfirmed(true)} type="button">
              {confirmed ? 'Schedule Confirmed' : 'Confirm Schedule'}
            </PrimaryButton>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
