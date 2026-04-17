import { type ClassValue, clsx } from 'clsx';
import { format, isPast, isToday } from 'date-fns';
import type { TaskPriority, TaskStatus } from '../types/database';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const statusLabelMap: Record<TaskStatus, string> = {
  done: 'Done',
  in_progress: 'In progress',
  todo: 'To do',
};

export const priorityLabelMap: Record<TaskPriority, string> = {
  high: 'High priority',
  low: 'Low priority',
  medium: 'Medium priority',
};

export const statusToneMap: Record<TaskStatus, string> = {
  done: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
  in_progress: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
  todo: 'bg-sky-100 text-sky-800 ring-1 ring-sky-200',
};

export const priorityToneMap: Record<TaskPriority, string> = {
  high: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
  low: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  medium: 'bg-violet-100 text-violet-700 ring-1 ring-violet-200',
};

export function formatDueDate(value: string | null) {
  if (!value) {
    return 'No due date';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'No due date';
  }

  if (isToday(date)) {
    return `Today · ${format(date, 'p')}`;
  }

  return format(date, 'MMM d, yyyy · p');
}

export function dueTone(value: string | null, status?: TaskStatus) {
  if (!value || status === 'done') {
    return 'text-slate-500';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'text-slate-500';
  }

  if (isPast(date) && !isToday(date)) {
    return 'text-rose-600';
  }

  if (isToday(date)) {
    return 'text-amber-700';
  }

  return 'text-slate-600';
}

export function toDateTimeInput(value: string | null) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function fromDateTimeInput(value: string) {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
}

export function getDisplayName(fullName: string | null | undefined, email?: string | null) {
  if (fullName?.trim()) {
    return fullName.trim();
  }

  if (email) {
    return email.split('@')[0];
  }

  return 'Planner user';
}

export function getInitials(name: string | null | undefined, email?: string | null) {
  const source = getDisplayName(name, email);
  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
