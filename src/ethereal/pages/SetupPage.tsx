import { CalendarSync, CheckCircle2, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { occupationOptions } from '../data';
import { useSanctuary } from '../context';
import { PrimaryButton, SecondaryButton, SectionEyebrow, SurfaceCard } from '../primitives';

export function SetupPage() {
  const navigate = useNavigate();
  const { setup, updateSetup } = useSanctuary();

  return (
    <div className="min-h-screen bg-[var(--ethereal-background)] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <header className="glass-panel mb-6 flex items-center justify-between rounded-[2rem] px-5 py-4 sm:px-8">
          <span className="font-display text-2xl font-semibold tracking-tight text-[var(--ethereal-primary)]">
            Ethereal
          </span>
          <nav className="hidden gap-6 text-sm font-medium text-[var(--ethereal-muted)] sm:flex">
            <span className="text-[var(--ethereal-primary)]">Setup</span>
            <span>Dashboard</span>
            <span>Insights</span>
          </nav>
          <div className="flex items-center gap-3 text-[var(--ethereal-muted)]">
            <Sparkles className="h-5 w-5" />
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="px-2 py-10 lg:px-10">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full bg-[rgba(149,213,167,0.28)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ethereal-secondary)]">
                Step 02 of 04
              </span>
              <h1 className="mt-6 max-w-md font-display text-5xl leading-[0.92] text-[var(--ethereal-ink)] sm:text-6xl">
                Architecting Your Rhythm
              </h1>
              <p className="mt-6 max-w-md text-lg leading-8 text-[var(--ethereal-muted)]">
                Let&apos;s define the boundaries of your digital sanctuary. We&apos;ll map your work hours and peak
                energy windows to protect your focus.
              </p>
            </div>

            <div className="ethereal-hero-art mt-12 max-w-md">
              <div className="ethereal-hero-glow" />
              <div className="absolute inset-x-6 bottom-6 rounded-[1.5rem] bg-[rgba(248,250,251,0.82)] px-5 py-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(58,190,249,0.16)] text-[var(--ethereal-primary)]">
                    <Zap className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold leading-6 text-[var(--ethereal-primary)]">
                    AI Insight: Users with defined peak hours report 40% less burnout.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <SurfaceCard className="px-6 py-7 sm:px-8 sm:py-8">
            <div className="grid gap-7">
              <div>
                <SectionEyebrow>Primary occupation</SectionEyebrow>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {occupationOptions.map((occupation) => (
                    <button
                      key={occupation}
                      className={`rounded-[1.25rem] px-4 py-4 text-left text-base font-semibold transition ${
                        setup.occupation === occupation
                          ? 'bg-[rgba(58,190,249,0.12)] text-[var(--ethereal-primary)] ring-1 ring-[rgba(58,190,249,0.48)]'
                          : 'bg-[var(--ethereal-surface-soft)] text-[var(--ethereal-muted)] hover:bg-[rgba(255,255,255,0.9)]'
                      }`}
                      onClick={() => updateSetup({ occupation })}
                      type="button"
                    >
                      {occupation}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <SectionEyebrow>Work hours</SectionEyebrow>
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      className="ethereal-input"
                      onChange={(event) => updateSetup({ workStart: event.target.value })}
                      type="time"
                      value={setup.workStart}
                    />
                    <span className="text-[var(--ethereal-muted)]">—</span>
                    <input
                      className="ethereal-input"
                      onChange={(event) => updateSetup({ workEnd: event.target.value })}
                      type="time"
                      value={setup.workEnd}
                    />
                  </div>
                </div>

                <div>
                  <SectionEyebrow>Peak energy</SectionEyebrow>
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      className="ethereal-input"
                      onChange={(event) => updateSetup({ peakStart: event.target.value })}
                      type="time"
                      value={setup.peakStart}
                    />
                    <span className="text-[var(--ethereal-muted)]">—</span>
                    <input
                      className="ethereal-input"
                      onChange={(event) => updateSetup({ peakEnd: event.target.value })}
                      type="time"
                      value={setup.peakEnd}
                    />
                  </div>
                </div>
              </div>

              <button
                className="flex items-center justify-between rounded-[1.5rem] border border-dashed border-[rgba(189,200,209,0.4)] bg-[var(--ethereal-surface-soft)] px-5 py-5 text-left transition hover:bg-white"
                onClick={() => updateSetup({ calendarConnected: !setup.calendarConnected })}
                type="button"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--ethereal-primary)]">
                    <CalendarSync className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[var(--ethereal-ink)]">Synchronize Ecosystem</p>
                    <p className="text-sm text-[var(--ethereal-muted)]">Import existing events for AI analysis</p>
                  </div>
                </div>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--ethereal-ink)]">
                  {setup.calendarConnected ? 'Connected' : 'Connect'}
                </span>
              </button>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <button className="text-sm font-semibold text-[var(--ethereal-muted)]" type="button">
                  Save for later
                </button>
                <div className="flex gap-3">
                  <SecondaryButton type="button">Back</SecondaryButton>
                  <PrimaryButton
                    onClick={() => {
                      updateSetup({ completed: true });
                      navigate('/flow');
                    }}
                    type="button"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
