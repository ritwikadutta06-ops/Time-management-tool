import { ArrowRight, CheckCircle2, Sparkles, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adaptiveProposal, flowBlocks, rescheduledFlowBlocks } from '../data';
import { useSanctuary } from '../context';
import { PrimaryButton, SecondaryButton, SectionEyebrow, StatPill, SurfaceCard } from '../primitives';

export function ReschedulePage() {
  const { applyAdaptiveReschedule, overloadResolved } = useSanctuary();

  return (
    <div className="space-y-4">
      <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
        <div className="rounded-[2rem] bg-[rgba(206,174,101,0.18)] px-5 py-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(206,174,101,0.34)] text-[var(--ethereal-tertiary)]">
                <TriangleAlert className="h-5 w-5" />
              </div>
              <div>
                <SectionEyebrow>Overload detected</SectionEyebrow>
                <h1 className="mt-2 text-4xl font-semibold text-[var(--ethereal-ink)]">Schedule Overload Detected</h1>
                <p className="mt-3 max-w-2xl text-base leading-8 text-[var(--ethereal-muted)]">
                  You are currently 120% booked for today. Estimated exhaustion time: 4:30 PM.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <PrimaryButton onClick={applyAdaptiveReschedule} type="button">
                Resolve now
              </PrimaryButton>
              <SecondaryButton type="button">Dismiss</SecondaryButton>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-4 xl:grid-cols-[1fr_auto_1fr] xl:items-center">
        <SurfaceCard className="px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <SectionEyebrow>Original plan</SectionEyebrow>
            <StatPill tone="warning">Inefficient</StatPill>
          </div>
          <div className="space-y-3">
            {flowBlocks.map((block) => (
              <div key={block.id} className="rounded-[1.5rem] bg-[var(--ethereal-surface-soft)] px-4 py-4">
                <p className="text-sm font-semibold text-[var(--ethereal-muted)]">{block.timeLabel}</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--ethereal-ink)]">{block.title}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <div className="hidden xl:flex xl:justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(58,190,249,0.16)] text-[var(--ethereal-primary)]">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>

        <SurfaceCard className="px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <SectionEyebrow>New adaptive proposal</SectionEyebrow>
            <StatPill tone="secondary">High energy match</StatPill>
          </div>
          <div className="space-y-3">
            {rescheduledFlowBlocks.map((block, index) => (
              <div
                key={block.id}
                className={`rounded-[1.5rem] px-4 py-4 ${
                  index === 0
                    ? 'bg-white shadow-[0_12px_32px_rgba(25,28,29,0.04)]'
                    : index === 1
                      ? 'bg-[var(--ethereal-surface-soft)]'
                      : 'bg-[rgba(149,213,167,0.18)]'
                }`}
              >
                <p className="text-sm font-semibold text-[var(--ethereal-muted)]">{block.label ?? block.meta[0]}</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--ethereal-ink)]">{block.title}</p>
                <p className="mt-2 text-sm text-[var(--ethereal-muted)]">{block.timeLabel}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard className="px-6 py-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <p className="text-base text-[var(--ethereal-muted)]">{adaptiveProposal.benefit}</p>
            <p className="text-base text-[var(--ethereal-muted)]">
              Predicted focus score will increase from {adaptiveProposal.from} to{' '}
              <span className="font-semibold text-[var(--ethereal-secondary)]">{adaptiveProposal.to}</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <PrimaryButton onClick={applyAdaptiveReschedule} type="button">
              {overloadResolved ? 'Adaptive schedule active' : 'Apply Reschedule'}
            </PrimaryButton>
            <SecondaryButton type="button">Defer Tasks</SecondaryButton>
            <SecondaryButton type="button">Delegate</SecondaryButton>
          </div>
        </div>

        {overloadResolved ? (
          <div className="mt-6 rounded-[1.5rem] bg-[rgba(149,213,167,0.18)] px-5 py-4 text-[var(--ethereal-secondary)]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Adaptive plan applied successfully.</span>
            </div>
            <Link className="mt-3 inline-flex items-center gap-2 text-sm font-semibold" to="/flow">
              Return to today&apos;s flow
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </SurfaceCard>
    </div>
  );
}
