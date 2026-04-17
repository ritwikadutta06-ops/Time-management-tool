/* eslint-disable react-refresh/only-export-components */
import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  archiveTask as archiveTaskRequest,
  createComment,
  getPlannerMode,
  listActivity,
  listComments,
  listProfiles,
  listTasks,
  recordActivity,
  upsertTask,
} from '../lib/plannerApi';
import type { ActivityLog, Profile, Task, TaskComment, TaskDraft } from '../types/database';
import { useAuth } from './AuthProvider';

interface PlannerContextValue {
  activity: ActivityLog[];
  archiveTask: (taskId: string) => Promise<void>;
  commentsByTask: Record<string, TaskComment[]>;
  dataMode: 'local' | 'supabase';
  error: string | null;
  loadComments: (taskId: string) => Promise<void>;
  loading: boolean;
  profiles: Profile[];
  refresh: () => Promise<void>;
  refreshing: boolean;
  saveTask: (draft: TaskDraft, taskId?: string) => Promise<void>;
  submitComment: (taskId: string, content: string) => Promise<void>;
  tasks: Task[];
}

const PlannerContext = createContext<PlannerContextValue | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const { profile, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [commentsByTask, setCommentsByTask] = useState<Record<string, TaskComment[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataMode, setDataMode] = useState<'local' | 'supabase'>(getPlannerMode());

  const hydrate = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setProfiles([]);
      setActivity([]);
      setCommentsByTask({});
      setLoading(false);
      return;
    }

    setError(null);

    try {
      const [nextTasks, nextProfiles] = await Promise.all([
        listTasks(user),
        listProfiles(user, profile),
      ]);

      setTasks(nextTasks);
      setProfiles(nextProfiles);
      setDataMode(getPlannerMode());

      if (profile?.role === 'admin') {
        const nextActivity = await listActivity(user);
        setActivity(nextActivity);
      } else {
        setActivity([]);
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unable to load planner data.';
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profile, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void hydrate();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [hydrate, profile?.role, user?.id]);

  async function refresh() {
    setRefreshing(true);
    await hydrate();
  }

  async function saveTask(draft: TaskDraft, taskId?: string) {
    if (!user) {
      return;
    }

    await upsertTask(user, draft, taskId);
    await recordActivity(
      user,
      taskId ? 'updated_task' : 'created_task',
      'task',
      taskId ?? null,
      { title: draft.title },
    );
    await refresh();
  }

  async function archiveTask(taskId: string) {
    if (!user) {
      return;
    }

    await archiveTaskRequest(user, taskId);
    await recordActivity(user, 'archived_task', 'task', taskId, { taskId });
    await refresh();
  }

  async function loadComments(taskId: string) {
    if (!user) {
      return;
    }

    const comments = await listComments(user, taskId);
    setCommentsByTask((current) => ({
      ...current,
      [taskId]: comments,
    }));
  }

  async function submitComment(taskId: string, content: string) {
    if (!user) {
      return;
    }

    await createComment(user, taskId, content);
    await recordActivity(user, 'commented_on_task', 'task_comment', taskId, { content });
    await loadComments(taskId);

    if (profile?.role === 'admin') {
      const nextActivity = await listActivity(user);
      setActivity(nextActivity);
    }
  }

  return (
    <PlannerContext.Provider
      value={{
        activity,
        archiveTask,
        commentsByTask,
        dataMode,
        error,
        loadComments,
        loading,
        profiles,
        refresh,
        refreshing,
        saveTask,
        submitComment,
        tasks,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used inside PlannerProvider');
  }

  return context;
}
