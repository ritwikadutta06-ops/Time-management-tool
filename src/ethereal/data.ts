import type {
  AdaptiveProposal,
  AlertSettings,
  FlowBlock,
  PendingTask,
  ProfileState,
  SetupState,
  SmartIntent,
  TaskItem,
} from './types';

export const occupationOptions = [
  'Software Engineer',
  'Product Manager',
  'Creative Director',
  'Researcher',
];

export const quickTags = ['#DeepWork', '#Internal', '#ClientFacing', '#Documentation'];

export const flowBlocks: FlowBlock[] = [];

export const rescheduledFlowBlocks: FlowBlock[] = [];

export const pendingTasks: PendingTask[] = [];

export const initialTasks: TaskItem[] = [];

export const initialIntents: SmartIntent[] = [];

export const baseSetup: SetupState = {
  calendarConnected: true,
  completed: false,
  occupation: 'Software Engineer',
  peakEnd: '12:00',
  peakStart: '10:00',
  workEnd: '17:00',
  workStart: '09:00',
};

export const baseProfile: ProfileState = {
  bio: 'Optimizing workflow for complex systems design and cross-functional team alignment.',
  meetingLoadThreshold: 4,
  name: 'Elena Vance',
  role: 'Lead Strategy Architect',
};

export const baseAlerts: AlertSettings = {
  adaptiveDnd: true,
  digestSummaries: false,
  focusModeOverride: true,
  gentleReminders: true,
};

export const adaptiveProposal: AdaptiveProposal = {
  benefit: 'Moving "Deep Dive" saves 45 mins of mental fatigue today.',
  buffer: '11:30 - 12:15',
  compressedMinutes: 30,
  delegatedTask: 'Design Review',
  delegatedTo: 'Sarah',
  from: '62',
  id: 'overload',
  overloadDetected: true,
  predictedScore: 88,
  to: '88',
};

export const meetingDensity = [0.15, 0.15, 0.72, 0.78, 0.22];
export const focusTrend = [0.48, 0.36, 0.56, 0.44, 0.68, 0.32, 0.76];
export const reportMomentum = [0.38, 0.52, 0.44, 0.61, 0.55, 0.64, 0.36, 0.24, 0.25, 0.43, 0.18, 0.21];
export const intensityFlow = [0.12, 0.34, 0.66, 0.92, 0.61, 0.24, 0.08];
