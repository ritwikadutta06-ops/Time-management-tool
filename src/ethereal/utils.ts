import { clsx, type ClassValue } from 'clsx';

export function cn(...values: ClassValue[]) {
  return clsx(values);
}

export function initials(values: string[]) {
  return values
    .map((value) => value.trim().charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function formatWindow(start: string, end: string) {
  const formatValue = (value: string) => {
    const [hour, minute] = value.split(':');
    const hourNumber = Number(hour);
    const suffix = hourNumber >= 12 ? 'PM' : 'AM';
    const normalizedHour = hourNumber % 12 || 12;
    return `${normalizedHour}:${minute} ${suffix}`;
  };

  return `${formatValue(start)} - ${formatValue(end)}`;
}

export function deriveIntentSuggestion(title: string, peakWindow: string) {
  const trimmed = title.trim();

  if (!trimmed) {
    return {
      energyWindow: peakWindow,
      effort: '2.0h',
      priority: 'High Impact',
      project: 'Focused Execution',
      summary:
        'Describe the next meaningful task and TaskPilot will shape it into a realistic focus block.',
    };
  }

  if (/review|sync|standup|meeting/i.test(trimmed)) {
    return {
      energyWindow: '2PM - 4PM',
      effort: '1.0h',
      priority: 'Strategic',
      project: 'Collaboration Stream',
      summary:
        'Meeting-shaped work fits best in your lower-friction window, keeping peak hours open for deep work.',
    };
  }

  if (/doc|write|architecture|system|design/i.test(trimmed)) {
    return {
      energyWindow: peakWindow,
      effort: '2.5h',
      priority: 'High Impact',
      project: 'Neural Core',
      summary:
        'Your recent performance suggests this work is strongest during your protected morning deep-work window.',
    };
  }

  return {
    energyWindow: peakWindow,
    effort: '1.5h',
    priority: 'Focused',
    project: 'Adaptive Execution',
    summary:
      'TaskPilot recommends anchoring this task inside a single calm block with minimal context switching.',
  };
}
