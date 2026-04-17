import { useDeferredValue, useEffect, useEffectEvent, useState, useTransition } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { TaskComposer } from '../components/TaskComposer';
import { TaskDetailPanel } from '../components/TaskDetailPanel';
import { cn, dueTone, formatDueDate, getDisplayName, priorityLabelMap, priorityToneMap, statusLabelMap, statusToneMap } from '../lib/utils';
import { useAuth } from '../providers/AuthProvider';
import { usePlanner } from '../providers/PlannerProvider';
import type { Task, TaskPriority, TaskStatus } from '../types/database';

type TaskFilter = 'all' | TaskStatus;
type PriorityFilter = 'all' | TaskPriority;

export function TasksPage() {
  const { profile } = useAuth();
  const {
    archiveTask,
    commentsByTask,
    loadComments,
    profiles,
    refreshing,
    saveTask,
    submitComment,
    tasks,
  } = usePlanner();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isFilterPending, startFilterTransition] = useTransition();

  const deferredSearch = useDeferredValue(search);
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null;
  const assignableProfiles = profiles.length ? profiles : profile ? [profile] : [];
  const hydrateComments = useEffectEvent(async (taskId: string) => {
    await loadComments(taskId);
  });

  useEffect(() => {
    if (!selectedTaskId) {
      return;
    }

    void hydrateComments(selectedTaskId);
  }, [selectedTaskId]);

  const filteredTasks = [...tasks]
    .filter((task) => !task.is_archived)
    .filter((task) =>
      statusFilter === 'all' ? true : task.status === statusFilter,
    )
    .filter((task) =>
      priorityFilter === 'all' ? true : task.priority === priorityFilter,
    )
    .filter((task) => {
      if (!deferredSearch.trim()) {
        return true;
      }

      const query = deferredSearch.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        (task.description ?? '').toLowerCase().includes(query)
      );
    })
    .sort((left, right) => {
      if (!left.due_date) {
        return 1;
      }

      if (!right.due_date) {
        return -1;
      }

      return new Date(left.due_date).getTime() - new Date(right.due_date).getTime();
    });

  return (
    <>
      <div className="grid gap-4">
        <section className="surface-panel px-5 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Task board</p>
              <h3 className="mt-2 font-display text-4xl text-slate-900">Control the work without losing momentum.</h3>
            </div>

            <button
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={() => {
                setEditingTask(null);
                setIsComposerOpen(true);
              }}
              type="button"
            >
              <Plus className="h-4 w-4" />
              New task
            </button>
          </div>

          <div className="mt-5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto_auto]">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title or description"
                value={search}
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {(['all', 'todo', 'in_progress', 'done'] as const).map((value) => (
                <button
                  key={value}
                  className={cn(
                    'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    statusFilter === value
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                  )}
                  onClick={() =>
                    startFilterTransition(() => {
                      setStatusFilter(value);
                    })
                  }
                  type="button"
                >
                  {value === 'all' ? 'All status' : statusLabelMap[value]}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {(['all', 'low', 'medium', 'high'] as const).map((value) => (
                <button
                  key={value}
                  className={cn(
                    'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    priorityFilter === value
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                  )}
                  onClick={() =>
                    startFilterTransition(() => {
                      setPriorityFilter(value);
                    })
                  }
                  type="button"
                >
                  {value === 'all' ? 'All priority' : value}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            {isFilterPending ? 'Updating filters...' : `${filteredTasks.length} tasks in view`}
          </div>
        </section>

        <section className="grid gap-3">
          {filteredTasks.length ? (
            filteredTasks.map((task) => (
              <article
                key={task.id}
                className="surface-panel cursor-pointer px-5 py-5 transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
                onClick={() => setSelectedTaskId(task.id)}
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusToneMap[task.status]}`}>
                        {statusLabelMap[task.status]}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityToneMap[task.priority]}`}>
                        {priorityLabelMap[task.priority]}
                      </span>
                    </div>
                    <h4 className="mt-4 text-xl font-semibold text-slate-900">{task.title}</h4>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                      {task.description?.trim() || 'No description added yet.'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 xl:items-end">
                    <div className={`text-sm font-medium ${dueTone(task.due_date, task.status)}`}>
                      {formatDueDate(task.due_date)}
                    </div>
                    <div className="text-sm text-slate-500">
                      Assigned to{' '}
                      <span className="font-semibold text-slate-700">
                        {task.assigned_to
                          ? getDisplayName(
                              assignableProfiles.find((assignee) => assignee.id === task.assigned_to)
                                ?.full_name,
                              task.assigned_to,
                            )
                          : 'Unassigned'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        onClick={(event) => {
                          event.stopPropagation();
                          setEditingTask(task);
                          setIsComposerOpen(true);
                        }}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                        onClick={(event) => {
                          event.stopPropagation();
                          void archiveTask(task.id);
                          if (selectedTaskId === task.id) {
                            setSelectedTaskId(null);
                          }
                        }}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="surface-panel px-5 py-10 text-center">
              <p className="font-display text-3xl text-slate-900">No tasks match the current filters.</p>
              <p className="mt-3 text-sm text-slate-500">
                Clear the filters or create a fresh task to keep the board moving.
              </p>
            </div>
          )}
        </section>
      </div>

      <TaskComposer
        key={editingTask?.id ?? 'new-task'}
        assignees={assignableProfiles}
        isOpen={isComposerOpen}
        onClose={() => {
          setIsComposerOpen(false);
          setEditingTask(null);
        }}
        onSubmit={async (draft) => {
          await saveTask(draft, editingTask?.id);
          setIsComposerOpen(false);
          setEditingTask(null);
        }}
        saving={refreshing}
        task={editingTask}
      />

      {selectedTask ? (
        <TaskDetailPanel
          comments={commentsByTask[selectedTask.id] ?? []}
          onClose={() => setSelectedTaskId(null)}
          onEdit={() => {
            setEditingTask(selectedTask);
            setIsComposerOpen(true);
          }}
          onSubmitComment={(content) => submitComment(selectedTask.id, content)}
          profiles={assignableProfiles}
          task={selectedTask}
        />
      ) : null}
    </>
  );
}
