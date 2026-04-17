import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { hasSupabaseEnv } from './env';
import type { ActivityLog, Profile, Task, TaskComment, TaskDraft } from '../types/database';

type PlannerMode = 'local' | 'supabase';

const runtime = {
  mode: hasSupabaseEnv ? ('supabase' as PlannerMode) : ('local' as PlannerMode),
};

const localKeys = {
  activity: (userId: string) => `ai-planner:activity:${userId}`,
  comments: (userId: string) => `ai-planner:comments:${userId}`,
  tasks: (userId: string) => `ai-planner:tasks:${userId}`,
};

function readLocal<T>(key: string, fallback: T) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return crypto.randomUUID();
}

function buildLocalProfile(user: User): Profile {
  const fullName =
    typeof user.user_metadata.full_name === 'string' ? user.user_metadata.full_name : null;
  const now = new Date().toISOString();

  return {
    avatar_url: null,
    created_at: now,
    full_name: fullName,
    id: user.id,
    role: user.user_metadata.role === 'admin' ? 'admin' : 'member',
    updated_at: now,
  };
}

function listLocalTasks(user: User) {
  return readLocal<Task[]>(localKeys.tasks(user.id), []);
}

function listLocalComments(user: User) {
  return readLocal<TaskComment[]>(localKeys.comments(user.id), []);
}

function listLocalActivity(user: User) {
  return readLocal<ActivityLog[]>(localKeys.activity(user.id), []);
}

async function withFallback<T>(primary: () => Promise<T>, fallback: () => Promise<T> | T) {
  if (runtime.mode === 'local') {
    return await fallback();
  }

  try {
    const result = await primary();
    runtime.mode = 'supabase';
    return result;
  } catch {
    runtime.mode = 'local';
    return await fallback();
  }
}

export function getPlannerMode() {
  return runtime.mode;
}

export async function listTasks(user: User) {
  return await withFallback(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data ?? [];
  }, async () => listLocalTasks(user).filter((task) => !task.is_archived));
}

export async function upsertTask(user: User, draft: TaskDraft, taskId?: string) {
  return await withFallback(
    async () => {
      const payload = {
        assigned_to: draft.assignedTo,
        description: draft.description || null,
        due_date: draft.dueDate,
        priority: draft.priority,
        status: draft.status,
        title: draft.title.trim(),
      };

      if (taskId) {
        const { data, error } = await supabase
          .from('tasks')
          .update(payload)
          .eq('id', taskId)
          .select('*')
          .single();

        if (error) {
          throw error;
        }

        return data;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...payload,
          created_by: user.id,
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    async () => {
      const tasks = listLocalTasks(user);
      const now = new Date().toISOString();
      const currentTask = tasks.find((task) => task.id === taskId);
      const nextTask: Task = taskId
        ? {
            ...(currentTask ?? {
              assigned_to: user.id,
              created_at: now,
              created_by: user.id,
              description: null,
              due_date: null,
              id: taskId,
              is_archived: false,
              priority: 'medium',
              status: 'todo',
              title: '',
              updated_at: now,
            }),
            assigned_to: draft.assignedTo,
            description: draft.description || null,
            due_date: draft.dueDate,
            priority: draft.priority,
            status: draft.status,
            title: draft.title.trim(),
            updated_at: now,
          }
        : {
            assigned_to: draft.assignedTo ?? user.id,
            created_at: now,
            created_by: user.id,
            description: draft.description || null,
            due_date: draft.dueDate,
            id: uid(),
            is_archived: false,
            priority: draft.priority,
            status: draft.status,
            title: draft.title.trim(),
            updated_at: now,
          };

      const nextTasks = taskId
        ? tasks.map((task) => (task.id === taskId ? nextTask : task))
        : [nextTask, ...tasks];

      writeLocal(localKeys.tasks(user.id), nextTasks);
      return nextTask;
    },
  );
}

export async function archiveTask(user: User, taskId: string) {
  await withFallback(
    async () => {
      const { error } = await supabase.from('tasks').update({ is_archived: true }).eq('id', taskId);

      if (error) {
        throw error;
      }

      return true;
    },
    async () => {
      const nextTasks = listLocalTasks(user).map((task) =>
        task.id === taskId
          ? {
              ...task,
              is_archived: true,
              updated_at: new Date().toISOString(),
            }
          : task,
      );
      writeLocal(localKeys.tasks(user.id), nextTasks);
      return true;
    },
  );
}

export async function listComments(user: User, taskId: string) {
  return await withFallback(
    async () => {
      const { data, error } = await supabase
        .from('task_comments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return data ?? [];
    },
    async () => listLocalComments(user).filter((comment) => comment.task_id === taskId),
  );
}

export async function createComment(user: User, taskId: string, content: string) {
  return await withFallback(
    async () => {
      const { data, error } = await supabase
        .from('task_comments')
        .insert({
          content,
          task_id: taskId,
          user_id: user.id,
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    async () => {
      const nextComment: TaskComment = {
        content,
        created_at: new Date().toISOString(),
        id: uid(),
        task_id: taskId,
        user_id: user.id,
      };

      const nextComments = [...listLocalComments(user), nextComment];
      writeLocal(localKeys.comments(user.id), nextComments);
      return nextComment;
    },
  );
}

export async function recordActivity(
  user: User,
  action: string,
  entityType: string,
  entityId: string | null,
  metadata: Record<string, string | null>,
) {
  await withFallback(
    async () => {
      const { error } = await supabase.from('activity_logs').insert({
        action,
        actor_id: user.id,
        entity_id: entityId,
        entity_type: entityType,
        metadata,
      });

      if (error) {
        throw error;
      }

      return true;
    },
    async () => {
      const nextActivity = [
        {
          action,
          actor_id: user.id,
          created_at: new Date().toISOString(),
          entity_id: entityId,
          entity_type: entityType,
          id: uid(),
          metadata,
        } satisfies ActivityLog,
        ...listLocalActivity(user),
      ];

      writeLocal(localKeys.activity(user.id), nextActivity);
      return true;
    },
  );
}

export async function listProfiles(user: User, currentProfile: Profile | null) {
  if (!hasSupabaseEnv) {
    return [currentProfile ?? buildLocalProfile(user)];
  }

  const { data, error } = await supabase.from('profiles').select('*').order('created_at');
  if (error || !data?.length) {
    return [currentProfile ?? buildLocalProfile(user)];
  }

  return data;
}

export async function listActivity(user: User) {
  if (runtime.mode === 'local') {
    return listLocalActivity(user);
  }

  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    return listLocalActivity(user);
  }

  return data ?? [];
}
