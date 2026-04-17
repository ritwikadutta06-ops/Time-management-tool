import { useState } from 'react';
import { X } from 'lucide-react';
import { cn, fromDateTimeInput, toDateTimeInput } from '../lib/utils';
import type { Profile, Task, TaskDraft, TaskPriority, TaskStatus } from '../types/database';

interface TaskComposerProps {
  assignees: Profile[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => Promise<void>;
  saving: boolean;
  task?: Task | null;
}

const priorities: TaskPriority[] = ['low', 'medium', 'high'];
const statuses: TaskStatus[] = ['todo', 'in_progress', 'done'];

const defaultDraft: TaskDraft = {
  assignedTo: null,
  description: '',
  dueDate: null,
  priority: 'medium',
  status: 'todo',
  title: '',
};

function taskToDraft(task?: Task | null): TaskDraft {
  if (!task) {
    return defaultDraft;
  }

  return {
    assignedTo: task.assigned_to,
    description: task.description ?? '',
    dueDate: task.due_date,
    priority: task.priority,
    status: task.status,
    title: task.title,
  };
}

export function TaskComposer({
  assignees,
  isOpen,
  onClose,
  onSubmit,
  saving,
  task,
}: TaskComposerProps) {
  const [draft, setDraft] = useState<TaskDraft>(() => taskToDraft(task));

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-panel w-full max-w-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              {task ? 'Update task' : 'Create task'}
            </p>
            <h3 className="mt-2 font-display text-3xl text-slate-900">
              {task ? 'Refine the next move.' : 'Add a task with clear ownership.'}
            </h3>
          </div>
          <button
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="mt-6 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit(draft);
          }}
        >
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              placeholder="Launch mobile onboarding review"
              required
              value={draft.title}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
              onChange={(event) =>
                setDraft((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Capture context, deliverables, and the success signal."
              value={draft.description}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <select
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    status: event.target.value as TaskStatus,
                  }))
                }
                value={draft.status}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Priority</span>
              <div className="grid grid-cols-3 gap-2">
                {priorities.map((priority) => (
                  <button
                    key={priority}
                    className={cn(
                      'rounded-2xl px-3 py-3 text-sm font-semibold capitalize transition',
                      draft.priority === priority
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    )}
                    onClick={() => setDraft((current) => ({ ...current, priority }))}
                    type="button"
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Due date</span>
              <input
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    dueDate: fromDateTimeInput(event.target.value),
                  }))
                }
                type="datetime-local"
                value={toDateTimeInput(draft.dueDate)}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Assignee</span>
              <select
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    assignedTo: event.target.value || null,
                  }))
                }
                value={draft.assignedTo ?? ''}
              >
                <option value="">Unassigned</option>
                {assignees.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.full_name || assignee.id}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={saving || !draft.title.trim()}
              type="submit"
            >
              {saving ? 'Saving...' : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
