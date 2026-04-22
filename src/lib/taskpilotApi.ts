import { hasSupabaseEnv } from './env';
import { supabase } from './supabase';
import type { TaskItem } from '../ethereal/types';

type SyncMode = 'local' | 'supabase';

const runtime = {
  mode: hasSupabaseEnv ? ('supabase' as SyncMode) : ('local' as SyncMode),
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabaseAny = supabase as any;

const localKeys = {
  clientId: 'taskpilot:client-id',
  tasks: (clientId: string) => `taskpilot:tasks:${clientId}`,
};

function getClientId() {
  const existing = window.localStorage.getItem(localKeys.clientId);
  if (existing) {
    return existing;
  }
  const next = crypto.randomUUID();
  window.localStorage.setItem(localKeys.clientId, next);
  return next;
}

function readLocalTasks(clientId: string) {
  const raw = window.localStorage.getItem(localKeys.tasks(clientId));
  if (!raw) {
    return [] as TaskItem[];
  }

  try {
    return JSON.parse(raw) as TaskItem[];
  } catch {
    return [] as TaskItem[];
  }
}

function writeLocalTasks(clientId: string, tasks: TaskItem[]) {
  window.localStorage.setItem(localKeys.tasks(clientId), JSON.stringify(tasks));
}

async function withFallback<T>(primary: () => Promise<T>, fallback: () => Promise<T> | T) {
  if (runtime.mode === 'local') {
    return await fallback();
  }

  try {
    const value = await primary();
    runtime.mode = 'supabase';
    return value;
  } catch {
    runtime.mode = 'local';
    return await fallback();
  }
}

export function getTaskSyncMode() {
  return runtime.mode;
}

export async function listTaskPilotTasks() {
  const clientId = getClientId();
  return await withFallback(
    async () => {
      const { data, error } = await supabaseAny
        .from('taskpilot_tasks')
        .select('id, title, due_at, priority, status, add_to_calendar, created_at')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((data ?? []) as any[]).map((row) => ({
        addToCalendar: row.add_to_calendar,
        createdAt: row.created_at,
        dueAt: row.due_at,
        id: row.id,
        priority: row.priority as TaskItem['priority'],
        status: row.status as TaskItem['status'],
        title: row.title,
      }));
    },
    async () => readLocalTasks(clientId),
  );
}

export async function createTaskPilotTask(task: TaskItem) {
  const clientId = getClientId();
  await withFallback(
    async () => {
      const { error } = await supabaseAny.from('taskpilot_tasks').insert({
        add_to_calendar: task.addToCalendar,
        client_id: clientId,
        created_at: task.createdAt,
        due_at: task.dueAt,
        id: task.id,
        priority: task.priority,
        status: task.status,
        title: task.title,
      });

      if (error) {
        throw error;
      }
      return true;
    },
    async () => {
      const next = [task, ...readLocalTasks(clientId)];
      writeLocalTasks(clientId, next);
      return true;
    },
  );
}

export async function updateTaskPilotTask(task: TaskItem) {
  const clientId = getClientId();
  await withFallback(
    async () => {
      const { error } = await supabaseAny
        .from('taskpilot_tasks')
        .update({
          add_to_calendar: task.addToCalendar,
          due_at: task.dueAt,
          priority: task.priority,
          status: task.status,
          title: task.title,
        })
        .eq('id', task.id)
        .eq('client_id', clientId);

      if (error) {
        throw error;
      }
      return true;
    },
    async () => {
      const next = readLocalTasks(clientId).map((item) => (item.id === task.id ? task : item));
      writeLocalTasks(clientId, next);
      return true;
    },
  );
}

export async function deleteTaskPilotTask(taskId: string) {
  const clientId = getClientId();
  await withFallback(
    async () => {
      const { error } = await supabaseAny
        .from('taskpilot_tasks')
        .delete()
        .eq('id', taskId)
        .eq('client_id', clientId);

      if (error) {
        throw error;
      }
      return true;
    },
    async () => {
      const next = readLocalTasks(clientId).filter((task) => task.id !== taskId);
      writeLocalTasks(clientId, next);
      return true;
    },
  );
}
