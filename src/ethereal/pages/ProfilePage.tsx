import { Brain, Lock, RotateCcw, ShieldCheck } from 'lucide-react';
import { useSanctuary } from '../context';
import { SectionEyebrow, SurfaceCard } from '../primitives';

function Toggle({
  checked,
  description,
  label,
  onToggle,
}: {
  checked: boolean;
  description: string;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      className="flex items-center justify-between rounded-[1.5rem] bg-[var(--ethereal-surface-soft)] px-4 py-4 text-left transition hover:bg-white"
      onClick={onToggle}
      type="button"
    >
      <div>
        <p className="font-semibold text-[var(--ethereal-ink)]">{label}</p>
        <p className="mt-1 text-sm text-[var(--ethereal-muted)]">{description}</p>
      </div>
      <span
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? 'bg-[var(--ethereal-secondary)]' : 'bg-[rgba(189,200,209,0.55)]'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </span>
    </button>
  );
}

export function ProfilePage() {
  const { alerts, peakEnergyLabel, profile, toggleAlert, updateProfile } = useSanctuary();
  const privacyFeatures = [
    {
      description: 'Sensitive insights never leave your device.',
      icon: Lock,
      title: 'Local Processing Only',
    },
    {
      description: 'Cognitive logs expire after 30 days.',
      icon: RotateCcw,
      title: 'Auto-Purge History',
    },
    {
      description: 'Vault locked via FaceID or TouchID.',
      icon: ShieldCheck,
      title: 'Biometric Access',
    },
  ];

  return (
    <div className="space-y-4">
      <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
        <h1 className="font-display text-5xl leading-[0.96] text-[var(--ethereal-ink)] sm:text-6xl">
          Your Sanctuary Profile
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--ethereal-muted)]">
          Personalize your cognitive environment for peak efficiency.
        </p>
      </SurfaceCard>

      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <SurfaceCard className="px-6 py-6">
          <div className="grid gap-6 lg:grid-cols-[120px_minmax(0,1fr)]">
            <div className="relative flex h-32 w-32 items-end overflow-hidden rounded-[1.5rem] bg-[linear-gradient(160deg,#d9edf7,#ffffff_50%,#dce8df)]">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(58,190,249,0.25),transparent_42%)]" />
              <span className="absolute bottom-4 left-4 font-display text-4xl text-[var(--ethereal-primary)]">
                EV
              </span>
            </div>

            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <SectionEyebrow>Legal name</SectionEyebrow>
                  <input
                    className="ethereal-input w-full"
                    onChange={(event) => updateProfile('name', event.target.value)}
                    value={profile.name}
                  />
                </label>
                <label className="grid gap-2">
                  <SectionEyebrow>Professional role</SectionEyebrow>
                  <input
                    className="ethereal-input w-full"
                    onChange={(event) => updateProfile('role', event.target.value)}
                    value={profile.role}
                  />
                </label>
              </div>
              <label className="grid gap-2">
                <SectionEyebrow>Bio focus</SectionEyebrow>
                <textarea
                  className="ethereal-input min-h-28 w-full resize-none"
                  onChange={(event) => updateProfile('bio', event.target.value)}
                  value={profile.bio}
                />
              </label>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-[2rem] bg-[rgba(58,190,249,0.16)] px-6 py-6">
          <div className="flex h-full flex-col items-start justify-center">
            <Brain className="h-10 w-10 text-[var(--ethereal-primary)]" />
            <h2 className="mt-5 text-3xl font-semibold text-[var(--ethereal-primary)]">Cognitive Harmony</h2>
            <p className="mt-4 text-base leading-8 text-[var(--ethereal-muted)]">
              “Elena, your focus is 22% higher when you delay meetings until after 10:00 AM. We’ve adjusted
              your suggested flow state accordingly.”
            </p>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SurfaceCard className="px-6 py-6">
          <SectionEyebrow>Cognitive baseline</SectionEyebrow>
          <p className="mt-4 text-sm font-semibold text-[var(--ethereal-primary)]">{peakEnergyLabel}</p>
          <div className="mt-4 flex h-16 items-end gap-2 rounded-[1.5rem] bg-[var(--ethereal-surface-soft)] p-3">
            {[0.16, 0.24, 0.62, 0.68, 0.58, 0.28, 0.18, 0.15].map((value, index) => (
              <div
                key={`${value}-${index}`}
                className={`${index >= 2 && index <= 4 ? 'bg-[var(--ethereal-primary)]' : 'bg-[rgba(58,190,249,0.24)]'} flex-1 rounded-md`}
                style={{ height: `${Math.max(18, value * 100)}%` }}
              />
            ))}
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <SectionEyebrow>Daily meeting load threshold</SectionEyebrow>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[var(--ethereal-ink)] shadow-[0_12px_32px_rgba(25,28,29,0.04)]">
                {profile.meetingLoadThreshold} hrs
              </span>
            </div>
            <input
              className="w-full accent-[var(--ethereal-primary)]"
              max={8}
              min={1}
              onChange={(event) => updateProfile('meetingLoadThreshold', Number(event.target.value))}
              type="range"
              value={profile.meetingLoadThreshold}
            />
          </div>
        </SurfaceCard>

        <SurfaceCard className="px-6 py-6">
          <SectionEyebrow>Smart alerts</SectionEyebrow>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Toggle
              checked={alerts.focusModeOverride}
              description="Allow urgent system pings"
              label="Focus Mode Override"
              onToggle={() => toggleAlert('focusModeOverride')}
            />
            <Toggle
              checked={alerts.gentleReminders}
              description="Non-obtrusive haptic feedback"
              label="Gentle Reminders"
              onToggle={() => toggleAlert('gentleReminders')}
            />
            <Toggle
              checked={alerts.digestSummaries}
              description="Evening AI recap report"
              label="Digest Summaries"
              onToggle={() => toggleAlert('digestSummaries')}
            />
            <Toggle
              checked={alerts.adaptiveDnd}
              description="Auto-detect deep work states"
              label="Adaptive DND"
              onToggle={() => toggleAlert('adaptiveDnd')}
            />
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard className="px-6 py-6">
        <SectionEyebrow>Privacy &amp; AI learning</SectionEyebrow>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--ethereal-muted)]">
          Control how TaskPilot processes your behavioral data. Your sanctuary remains yours; we only learn
          to serve you better, never to share your patterns.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {privacyFeatures.map(({ description, icon: Icon, title }) => {
            return (
              <div key={title} className="rounded-[1.5rem] bg-[var(--ethereal-surface-soft)] px-4 py-5">
                <Icon className="h-5 w-5 text-[var(--ethereal-muted)]" />
                <p className="mt-4 font-semibold text-[var(--ethereal-ink)]">{title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--ethereal-muted)]">{description}</p>
              </div>
            );
          })}
        </div>
      </SurfaceCard>
    </div>
  );
}
