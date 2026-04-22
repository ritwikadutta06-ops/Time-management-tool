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

  if (/bug|fix|issue|error|crash/i.test(trimmed)) {
    return {
      energyWindow: 'Immediate',
      effort: '0.5h',
      priority: 'Urgent',
      project: 'Targeted Maintenance',
      summary: 'Maintenance and debugging often require immediate focus but shorter bursts. Tackle this early to unblock momentum.',
    };
  }

  if (/review|sync|standup|meeting|call|discuss/i.test(trimmed)) {
    return {
      energyWindow: '2PM - 4PM',
      effort: '1.0h',
      priority: 'Strategic',
      project: 'Collaboration Stream',
      summary:
        'Meeting-shaped work fits best in your lower-friction window, keeping peak hours open for deep work.',
    };
  }

  if (/doc|write|architecture|system|design|plan|strategy|learn/i.test(trimmed)) {
    return {
      energyWindow: peakWindow,
      effort: '2.5h',
      priority: 'High Impact',
      project: 'Neural Core',
      summary:
        'Your recent performance suggests this work is strongest during your protected morning deep-work window.',
    };
  }

  if (/email|reply|slack|message|admin|invoice|pay/i.test(trimmed)) {
    return {
      energyWindow: '4PM - 5PM',
      effort: '30m',
      priority: 'Low Friction',
      project: 'Admin & Comms',
      summary: 'Communication and admin work should be batched at the end of your day to avoid disrupting flow state.',
    };
  }

  const wordCount = trimmed.split(' ').length;
  const effort = wordCount > 5 ? '2.0h' : '1.0h';

  return {
    energyWindow: peakWindow,
    effort,
    priority: 'Focused',
    project: 'Adaptive Execution',
    summary:
      `TaskPilot analyzed your input and recommends anchoring this inside a ${effort} calm block with minimal context switching.`,
  };
}
