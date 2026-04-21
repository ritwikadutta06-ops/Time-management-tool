/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  adaptiveProposal,
  baseAlerts,
  baseProfile,
  baseSetup,
  flowBlocks,
  initialIntents,
  initialTasks,
  pendingTasks,
  rescheduledFlowBlocks,
} from './data';
import {
  createTaskPilotTask,
  deleteTaskPilotTask,
  listTaskPilotTasks,
  updateTaskPilotTask,
} from '../lib/taskpilotApi';
import type {
  AlertSettings,
  FlowBlock,
  PendingTask,
  ProfileState,
  SetupState,
  SmartIntent,
  TaskItem,
  TaskPriority,
  TaskStatus,
} from './types';
import { deriveIntentSuggestion, formatWindow } from './utils';

interface SanctuaryState {
  alerts: AlertSettings;
  focusScore: number;
  intents: SmartIntent[];
  overloadResolved: boolean;
  pending: PendingTask[];
  profile: ProfileState;
  realismGauge: number;
  setup: SetupState;
  tasks: TaskItem[];
}

interface SanctuaryContextValue extends SanctuaryState {
  activeFlow: FlowBlock[];
  adaptiveProposalScore: number;
  applyAdaptiveReschedule: () => void;
  commitIntent: (draft: { addToCalendar: boolean; dueAt: string | null; priority: TaskPriority; title: string }) => void;
  peakEnergyLabel: string;
  removeTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  toggleAlert: (key: keyof AlertSettings) => void;
  updateProfile: <K extends keyof ProfileState>(key: K, value: ProfileState[K]) => void;
  updateSetup: (partial: Partial<SetupState>) => void;
}

const storageKey = 'ethereal-sanctuary-state';
const SanctuaryContext = createContext<SanctuaryContextValue | undefined>(undefined);
const fallbackState: SanctuaryState = {
  alerts: baseAlerts,
  focusScore: 84,
  intents: initialIntents,
  overloadResolved: false,
  pending: pendingTasks,
  profile: baseProfile,
  realismGauge: 75,
  setup: baseSetup,
  tasks: initialTasks,
};

function formatDeadline(dueAt: string | null) {
  if (!dueAt) {
    return 'No due date';
  }
  const value = new Date(dueAt);
  return `Due ${value.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}, ${value.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
}

function toFlowBlock(task: TaskItem): FlowBlock | null {
  if (!task.addToCalendar || !task.dueAt) {
    return null;
  }

  const due = new Date(task.dueAt);
  const start = new Date(due.getTime() - 30 * 60 * 1000);

  return {
    accent: task.priority === 'high' ? 'var(--ethereal-tertiary)' : 'var(--ethereal-primary)',
    end: due.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
    id: `calendar-${task.id}`,
    label: 'TaskPilot calendar',
    meta: ['User scheduled', task.priority.toUpperCase()],
    start: start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
    timeLabel: `${start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} - ${due.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`,
    title: task.title,
    tone: 'focus',
  };
}

function loadInitialState(): SanctuaryState {
  if (typeof window === 'undefined') {
    return fallbackState;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return fallbackState;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SanctuaryState>;
    return {
      ...fallbackState,
      ...parsed,
      tasks: parsed.tasks?.length ? parsed.tasks : fallbackState.tasks,
    };
  } catch {
    return fallbackState;
  }
}

export function SanctuaryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SanctuaryState>(() => loadInitialState());

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    let active = true;
    void (async () => {
      const remoteTasks = await listTaskPilotTasks();
      if (!active || !remoteTasks.length) {
        return;
      }

      setState((current) => ({
        ...current,
        pending: remoteTasks
          .slice()
          .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
          .slice(0, 5)
          .map((task) => ({
            due: formatDeadline(task.dueAt),
            id: task.id,
            priority: task.priority,
            title: task.title,
          })),
        tasks: remoteTasks,
      }));
    })();

    return () => {
      active = false;
    };
  }, []);

  const peakEnergyLabel = useMemo(
    () => formatWindow(state.setup.peakStart, state.setup.peakEnd),
    [state.setup.peakEnd, state.setup.peakStart],
  );

  const value = useMemo<SanctuaryContextValue>(
    () => ({
      adaptiveProposalScore: adaptiveProposal.predictedScore,
      alerts: state.alerts,
      applyAdaptiveReschedule: () => {
        setState((current) => ({
          ...current,
          focusScore: adaptiveProposal.predictedScore,
          overloadResolved: true,
          realismGauge: 86,
        }));
      },
      commitIntent: ({ addToCalendar, dueAt, priority, title }) => {
        const normalizedTitle = title.trim();
        if (!normalizedTitle) {
          return;
        }

        const nextSuggestion = deriveIntentSuggestion(normalizedTitle, peakEnergyLabel);
        const nextIntent: SmartIntent = {
          collaborators: ['AV', 'SR'],
          deadline: formatDeadline(dueAt),
          energyWindow: nextSuggestion.energyWindow,
          effort: nextSuggestion.effort,
          id: crypto.randomUUID(),
          priority: nextSuggestion.priority,
          project: nextSuggestion.project,
          summary: nextSuggestion.summary,
          tags: ['#DeepWork', '#Internal'],
          title: normalizedTitle,
        };

        const nextTask: TaskItem = {
          addToCalendar,
          createdAt: new Date().toISOString(),
          dueAt,
          id: nextIntent.id,
          priority,
          status: 'todo',
          title: normalizedTitle,
        };

        setState((current) => ({
          ...current,
          intents: [nextIntent, ...current.intents],
          pending: [
            {
              due: formatDeadline(dueAt),
              id: nextTask.id,
              priority,
              title: nextTask.title,
            },
            ...current.pending,
          ].slice(0, 5),
          tasks: [nextTask, ...current.tasks],
        }));
        void createTaskPilotTask(nextTask);
      },
      focusScore: state.focusScore,
      intents: state.intents,
      overloadResolved: state.overloadResolved,
      peakEnergyLabel,
      pending: state.pending,
      profile: state.profile,
      realismGauge: state.realismGauge,
      setup: state.setup,
      tasks: state.tasks,
      removeTask: (taskId) => {
        setState((current) => ({
          ...current,
          pending: current.pending.filter((task) => task.id !== taskId),
          tasks: current.tasks.filter((task) => task.id !== taskId),
        }));
        void deleteTaskPilotTask(taskId);
      },
      toggleTaskStatus: (taskId) => {
        setState((current) => {
          const nextTasks = current.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: (task.status === 'todo' ? 'done' : 'todo') as TaskStatus,
                }
              : task,
          );

          const nextTask = nextTasks.find((task) => task.id === taskId);
          if (nextTask) {
            void updateTaskPilotTask(nextTask);
          }

          return {
            ...current,
            tasks: nextTasks,
          };
        });
      },
      toggleAlert: (key) => {
        setState((current) => ({
          ...current,
          alerts: {
            ...current.alerts,
            [key]: !current.alerts[key],
          },
        }));
      },
      updateProfile: (key, value) => {
        setState((current) => ({
          ...current,
          profile: {
            ...current.profile,
            [key]: value,
          },
        }));
      },
      updateSetup: (partial) => {
        setState((current) => ({
          ...current,
          setup: {
            ...current.setup,
            ...partial,
          },
        }));
      },
      activeFlow: [
        ...(state.overloadResolved ? rescheduledFlowBlocks : flowBlocks),
        ...state.tasks
          .filter((task) => task.status === 'todo')
          .sort((left, right) => (new Date(left.dueAt ?? 0).getTime() - new Date(right.dueAt ?? 0).getTime()))
          .map(toFlowBlock)
          .filter((task): task is FlowBlock => Boolean(task))
      ],
    }),
    [peakEnergyLabel, state],
  );

  return <SanctuaryContext.Provider value={value}>{children}</SanctuaryContext.Provider>;
}

export function useSanctuary() {
  const context = useContext(SanctuaryContext);
  if (!context) {
    throw new Error('useSanctuary must be used inside SanctuaryProvider');
  }

  return context;
}
