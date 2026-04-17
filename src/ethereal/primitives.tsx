import { CircleUserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn, initials } from './utils';

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'ethereal-primary-button inline-flex items-center justify-center gap-2 rounded-[1.25rem] px-5 py-3.5 text-sm font-semibold text-white transition hover:translate-y-[-1px]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-[var(--ethereal-surface-strong)] px-5 py-3.5 text-sm font-semibold text-[var(--ethereal-ink)] transition hover:bg-white',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SurfaceCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('ethereal-surface', className)}>{children}</div>;
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ethereal-muted)]">
      {children}
    </p>
  );
}

export function StatPill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'primary' | 'secondary' | 'warning';
}) {
  const toneClass =
    tone === 'primary'
      ? 'bg-[rgba(58,190,249,0.16)] text-[var(--ethereal-primary)]'
      : tone === 'secondary'
        ? 'bg-[rgba(149,213,167,0.24)] text-[var(--ethereal-secondary)]'
        : tone === 'warning'
          ? 'bg-[rgba(206,174,101,0.22)] text-[var(--ethereal-tertiary)]'
          : 'bg-[var(--ethereal-surface-soft)] text-[var(--ethereal-muted)]';

  return <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', toneClass)}>{children}</span>;
}

export function MiniBars({
  values,
  highlightIndex,
}: {
  values: number[];
  highlightIndex?: number;
}) {
  return (
    <div className="flex h-32 items-end gap-2 rounded-[1.5rem] bg-[var(--ethereal-surface-soft)] p-4">
      {values.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className={cn(
            'flex-1 rounded-full',
            highlightIndex === index ? 'bg-[var(--ethereal-primary)]' : 'bg-[rgba(58,190,249,0.38)]',
          )}
          style={{ height: `${Math.max(12, value * 100)}%` }}
        />
      ))}
    </div>
  );
}

export function AvatarStack({ values }: { values: string[] }) {
  return (
    <div className="flex -space-x-2">
      {values.map((value) => (
        <div
          key={value}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ethereal-surface-strong)] text-xs font-bold text-[var(--ethereal-primary)] ring-2 ring-white"
          title={value}
        >
          {initials([value])}
        </div>
      ))}
      {!values.length ? (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ethereal-surface-strong)] text-[var(--ethereal-muted)] ring-2 ring-white">
          <CircleUserRound className="h-4 w-4" />
        </div>
      ) : null}
    </div>
  );
}
