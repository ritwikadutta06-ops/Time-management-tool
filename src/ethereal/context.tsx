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
  pendingTasks,
  rescheduledFlowBlocks,
} from './data';
import type { AlertSettings, FlowBlock, PendingTask, ProfileState, SetupState, SmartIntent } from './types';
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
}

interface SanctuaryContextValue extends SanctuaryState {
  activeFlow: FlowBlock[];
  adaptiveProposalScore: number;
  applyAdaptiveReschedule: () => void;
  commitIntent: (title: string) => void;
  peakEnergyLabel: string;
  toggleAlert: (key: keyof AlertSettings) => void;
  updateProfile: <K extends keyof ProfileState>(key: K, value: ProfileState[K]) => void;
  updateSetup: (partial: Partial<SetupState>) => void;
}

const storageKey = 'ethereal-sanctuary-state';
const SanctuaryContext = createContext<SanctuaryContextValue | undefined>(undefined);

function loadInitialState(): SanctuaryState {
  if (typeof window === 'undefined') {
    return {
      alerts: baseAlerts,
      focusScore: 84,
      intents: initialIntents,
      overloadResolved: false,
      pending: pendingTasks,
      profile: baseProfile,
      realismGauge: 75,
      setup: baseSetup,
    };
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return {
      alerts: baseAlerts,
      focusScore: 84,
      intents: initialIntents,
      overloadResolved: false,
      pending: pendingTasks,
      profile: baseProfile,
      realismGauge: 75,
      setup: baseSetup,
    };
  }

  try {
    return JSON.parse(raw) as SanctuaryState;
  } catch {
    return {
      alerts: baseAlerts,
      focusScore: 84,
      intents: initialIntents,
      overloadResolved: false,
      pending: pendingTasks,
      profile: baseProfile,
      realismGauge: 75,
      setup: baseSetup,
    };
  }
}

export function SanctuaryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SanctuaryState>(() => loadInitialState());

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const peakEnergyLabel = useMemo(
    () => formatWindow(state.setup.peakStart, state.setup.peakEnd),
    [state.setup.peakEnd, state.setup.peakStart],
  );

  const value = useMemo<SanctuaryContextValue>(
    () => ({
      activeFlow: state.overloadResolved ? rescheduledFlowBlocks : flowBlocks,
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
      commitIntent: (title: string) => {
        const nextSuggestion = deriveIntentSuggestion(title, peakEnergyLabel);
        const nextIntent: SmartIntent = {
          collaborators: ['AV', 'SR'],
          deadline: 'Tomorrow, 5:00 PM',
          energyWindow: nextSuggestion.energyWindow,
          effort: nextSuggestion.effort,
          id: crypto.randomUUID(),
          priority: nextSuggestion.priority,
          project: nextSuggestion.project,
          summary: nextSuggestion.summary,
          tags: ['#DeepWork', '#Internal'],
          title: title.trim(),
        };

        const nextPending: PendingTask = {
          due: `${nextIntent.priority} · ${nextIntent.effort}`,
          id: nextIntent.id,
          priority: nextIntent.priority.toLowerCase(),
          title: nextIntent.title,
        };

        setState((current) => ({
          ...current,
          intents: [nextIntent, ...current.intents],
          pending: [nextPending, ...current.pending].slice(0, 5),
        }));
      },
      focusScore: state.focusScore,
      intents: state.intents,
      overloadResolved: state.overloadResolved,
      peakEnergyLabel,
      pending: state.pending,
      profile: state.profile,
      realismGauge: state.realismGauge,
      setup: state.setup,
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
