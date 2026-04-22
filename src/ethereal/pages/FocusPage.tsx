import { Pause, Play, TimerReset, TriangleAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSanctuary } from '../context';
import { PrimaryButton, SecondaryButton, SectionEyebrow, SurfaceCard } from '../primitives';

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function FocusPage() {
  const { intents, tasks, activeFlow } = useSanctuary();
  const [secondsRemaining, setSecondsRemaining] = useState(24 * 60 + 18);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running]);

  const progress = useMemo(() => ((25 * 60 - secondsRemaining) / (25 * 60)) * 360, [secondsRemaining]);
  const activeIntent = intents[0];
  const pendingTasks = tasks.filter((t) => t.status === 'todo' && t.id !== activeIntent?.id);
  const upcomingMeeting = activeFlow.find((f) => f.tone === 'meeting');

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
        <SectionEyebrow>Currently focusing on</SectionEyebrow>
        <h1 className="mt-3 max-w-xl font-display text-5xl leading-[0.92] text-[var(--ethereal-ink)] sm:text-6xl">
          {activeIntent?.title ?? 'Design System Architecture'}
        </h1>

        <div className="mt-10 flex flex-col items-center gap-10 xl:flex-row xl:items-start">
          <div className="flex flex-col items-center">
            <div
              className="flex h-72 w-72 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(var(--ethereal-primary) ${progress}deg, rgba(189,200,209,0.35) 0deg)`,
              }}
            >
              <div className="flex h-56 w-56 flex-col items-center justify-center rounded-full bg-[var(--ethereal-background)]">
                <span className="font-display text-7xl leading-none text-[var(--ethereal-ink)]">
                  {formatTimer(secondsRemaining)}
                </span>
                <span className="mt-3 text-sm font-medium text-[var(--ethereal-muted)]">Remaining</span>
              </div>
            </div>

            <SurfaceCard className="mt-8 w-full max-w-md bg-[var(--ethereal-surface-soft)] px-5 py-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-[var(--ethereal-tertiary)]">
                  <TriangleAlert className="h-5 w-5" />
                  <div>
                    <p className="font-semibold text-[var(--ethereal-ink)]">Something came up?</p>
                    <p className="text-sm text-[var(--ethereal-muted)]">Protect the session without losing the whole block.</p>
                  </div>
                </div>
                <SecondaryButton onClick={() => setRunning(false)} type="button">
                  Get interrupted
                </SecondaryButton>
              </div>
              <div className="mt-4 flex gap-3">
                <SecondaryButton onClick={() => setSecondsRemaining((current) => current + 10 * 60)} type="button">
                  10m Delay
                </SecondaryButton>
                <Link className="ethereal-secondary-link" to="/reschedule">
                  Reschedule
                </Link>
              </div>
            </SurfaceCard>
          </div>

          <div className="grid flex-1 gap-4">
            <SurfaceCard className="rounded-[2rem] bg-[rgba(58,190,249,0.12)] px-5 py-5">
              <SectionEyebrow>AI strategy</SectionEyebrow>
              <p className="mt-4 text-base leading-8 text-[var(--ethereal-ink)]">
                {activeIntent?.summary ??
                  'Your energy levels usually dip in 40 minutes. Try to wrap the core pass by 11:30 AM.'}
              </p>
            </SurfaceCard>

            <SurfaceCard className="px-5 py-5">
              <SectionEyebrow>Next task</SectionEyebrow>
              <p className="mt-4 text-2xl font-semibold text-[var(--ethereal-ink)]">
                {pendingTasks[0]?.title ?? 'React Components Prep'}
              </p>
              <p className="mt-2 text-sm text-[var(--ethereal-muted)]">
                {pendingTasks[0] ? `Priority: ${pendingTasks[0].priority}` : 'Starts in 45 minutes'}
              </p>
            </SurfaceCard>

            <SurfaceCard className="px-5 py-5">
              <SectionEyebrow>Upcoming meeting</SectionEyebrow>
              <p className="mt-4 text-2xl font-semibold text-[var(--ethereal-ink)]">
                {upcomingMeeting?.title ?? 'Weekly Sync'}
              </p>
              <p className="mt-2 text-sm text-[var(--ethereal-muted)]">
                {upcomingMeeting ? upcomingMeeting.timeLabel : '1:00 PM · 30 mins'}
              </p>
            </SurfaceCard>

            <div className="ethereal-city-card">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.65))]" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(circle_at_bottom,rgba(58,190,249,0.3),transparent_70%)]" />
              <button
                className="absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ethereal-primary)] text-white shadow-[0_12px_32px_rgba(25,28,29,0.12)]"
                onClick={() => setRunning((current) => (!current && secondsRemaining > 0))}
                type="button"
              >
                {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton onClick={() => setRunning((current) => (!current && secondsRemaining > 0))} type="button">
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {running ? 'Pause focus' : 'Start focus'}
              </PrimaryButton>
              <SecondaryButton onClick={() => setSecondsRemaining(24 * 60 + 18)} type="button">
                <TimerReset className="h-4 w-4" />
                Reset timer
              </SecondaryButton>
            </div>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
