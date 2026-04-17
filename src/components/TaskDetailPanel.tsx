import { useState } from 'react';
import { MessageSquareMore, Pencil, SendHorizonal, X } from 'lucide-react';
import { cn, dueTone, formatDueDate, getDisplayName, priorityLabelMap, priorityToneMap, statusLabelMap, statusToneMap } from '../lib/utils';
import type { Profile, Task, TaskComment } from '../types/database';

interface TaskDetailPanelProps {
  comments: TaskComment[];
  onClose: () => void;
  onEdit: () => void;
  onSubmitComment: (content: string) => Promise<void>;
  profiles: Profile[];
  task: Task;
}

function profileNameById(profiles: Profile[], userId: string | null, fallback = 'Unassigned') {
  if (!userId) {
    return fallback;
  }

  return getDisplayName(profiles.find((profile) => profile.id === userId)?.full_name, userId);
}

export function TaskDetailPanel({
  comments,
  onClose,
  onEdit,
  onSubmitComment,
  profiles,
  task,
}: TaskDetailPanelProps) {
  const [comment, setComment] = useState('');
  const assigneeName = profileNameById(profiles, task.assigned_to);
  const creatorName = profileNameById(profiles, task.created_by, 'Unknown');

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-xl border-l border-white/70 bg-[#fbf8f1] p-5 shadow-[-20px_0_60px_rgba(15,23,42,0.18)] backdrop-blur xl:p-7">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Task details</p>
            <h3 className="mt-2 font-display text-3xl text-slate-900">{task.title}</h3>
          </div>
          <button
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-white hover:text-slate-900"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', statusToneMap[task.status])}>
            {statusLabelMap[task.status]}
          </span>
          <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', priorityToneMap[task.priority])}>
            {priorityLabelMap[task.priority]}
          </span>
          <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', dueTone(task.due_date, task.status))}>
            {formatDueDate(task.due_date)}
          </span>
        </div>

        <div className="mt-6 grid gap-4 rounded-[28px] bg-white/90 p-5 ring-1 ring-slate-200/60">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Context</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {task.description?.trim() || 'No description added yet.'}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Assignee</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{assigneeName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Created by</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{creatorName}</p>
            </div>
          </div>

          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={onEdit}
            type="button"
          >
            <Pencil className="h-4 w-4" />
            Edit task
          </button>
        </div>

        <div className="mt-6 flex min-h-0 flex-1 flex-col rounded-[28px] bg-white/90 p-5 ring-1 ring-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <MessageSquareMore className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Task conversation</p>
              <p className="text-sm text-slate-500">Keep decisions attached to the work itself.</p>
            </div>
          </div>

          <div className="mt-5 flex-1 space-y-3 overflow-y-auto pr-1">
            {comments.length ? (
              comments.map((entry) => (
                <div key={entry.id} className="rounded-2xl bg-[#f7f2e8] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {profileNameById(profiles, entry.user_id, 'Team member')}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{entry.content}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                No comments yet. Capture blockers, decisions, or handoff notes here.
              </div>
            )}
          </div>

          <form
            className="mt-5 flex gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!comment.trim()) {
                return;
              }

              void onSubmitComment(comment.trim()).then(() => setComment(''));
            }}
          >
            <input
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              onChange={(event) => setComment(event.target.value)}
              placeholder="Add the next decision, blocker, or follow-up."
              value={comment}
            />
            <button
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 text-white transition hover:bg-slate-800"
              type="submit"
            >
              <SendHorizonal className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
