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

export const flowBlocks: FlowBlock[] = [
  {
    accent: 'var(--ethereal-secondary)',
    description: '2.5h',
    end: '12:30 PM',
    id: 'deep-work',
    label: 'Peak energy zone',
    meta: ['Focus Mode Active', '3 Resources'],
    participants: 2,
    start: '10:00 AM',
    timeLabel: '10:00 AM - 12:30 PM',
    title: 'Deep Work: Interface Design',
    tone: 'focus',
  },
  {
    accent: 'var(--ethereal-outline-soft)',
    end: '1:30 PM',
    id: 'recovery',
    meta: ['Lunch reset'],
    start: '12:30 PM',
    timeLabel: '12:30 PM - 1:30 PM',
    title: 'Strategic Recovery & Lunch',
    tone: 'recovery',
  },
  {
    accent: 'var(--ethereal-primary)',
    end: '3:00 PM',
    id: 'architecture-review',
    meta: ['Core sync'],
    note: '"Ensure the API layer reflects the new design tokens."',
    start: '2:00 PM',
    timeLabel: '2:00 PM - 3:00 PM',
    title: 'Sync: Architecture Review',
    tone: 'meeting',
  },
];

export const rescheduledFlowBlocks: FlowBlock[] = [
  {
    accent: 'var(--ethereal-primary)',
    description: '1.5h',
    end: '10:30 AM',
    id: 'deep-work-rescheduled',
    label: 'High impact',
    meta: ['Compressed sprint', 'Peak energy protected'],
    start: '9:00 AM',
    timeLabel: '9:00 AM - 10:30 AM',
    title: 'Project Deep Dive',
    tone: 'focus',
  },
  {
    accent: 'var(--ethereal-secondary)',
    end: '11:30 AM',
    id: 'team-sync-rescheduled',
    meta: ['Rescheduled'],
    start: '10:45 AM',
    timeLabel: '10:45 AM - 11:30 AM',
    title: 'Team Sync',
    tone: 'meeting',
  },
  {
    accent: 'var(--ethereal-mint-soft)',
    end: '12:15 PM',
    id: 'buffer',
    meta: ['AI-generated buffer'],
    start: '11:30 AM',
    timeLabel: '11:30 AM - 12:15 PM',
    title: 'AI Buffer: Recharge & Transition',
    tone: 'recovery',
  },
];

export const pendingTasks: PendingTask[] = [
  {
    due: 'High priority · 15m',
    id: 'review-docs',
    priority: 'high',
    title: 'Review design system docs',
  },
  {
    due: 'Low priority · 10m',
    id: 'update-board',
    priority: 'low',
    title: 'Update sprint board',
  },
  {
    due: 'Due today · Critical',
    id: 'approve-exports',
    priority: 'critical',
    title: 'Approve payroll exports',
  },
];

export const initialTasks: TaskItem[] = [
  {
    addToCalendar: true,
    createdAt: new Date().toISOString(),
    dueAt: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    id: 'brand-identity',
    priority: 'high',
    status: 'todo',
    title: 'Brand Identity Workshop',
  },
  {
    addToCalendar: true,
    createdAt: new Date().toISOString(),
    dueAt: new Date(new Date().setHours(16, 30, 0, 0)).toISOString(),
    id: 'architecture-doc',
    priority: 'medium',
    status: 'todo',
    title: 'Design System Architecture',
  },
];

export const initialIntents: SmartIntent[] = [
  {
    collaborators: ['AV', 'MK', 'SR'],
    deadline: 'Tomorrow, 5:00 PM',
    effort: '2.5h',
    energyWindow: '10AM - 12PM',
    id: 'brand-identity',
    priority: 'High Impact',
    project: 'TaskPilot Design',
    summary: 'Based on your past workshops, this typically requires deep preparation and follow-up docs.',
    tags: ['#DeepWork', '#ClientFacing'],
    title: 'Brand Identity Workshop',
  },
  {
    collaborators: ['AV', 'JT'],
    deadline: 'Today, 4:30 PM',
    effort: '1.5h',
    energyWindow: '11AM - 12PM',
    id: 'architecture-doc',
    priority: 'Strategic',
    project: 'Neural Core',
    summary: 'AI detected a high cognitive match for structured architecture writing before lunch.',
    tags: ['#Documentation', '#Internal'],
    title: 'Design System Architecture',
  },
];

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
