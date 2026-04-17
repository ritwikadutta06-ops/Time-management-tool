export type SidebarSection = 'planner' | 'tasks' | 'intelligence' | 'settings';

export interface SetupState {
  calendarConnected: boolean;
  completed: boolean;
  occupation: string;
  peakEnd: string;
  peakStart: string;
  workEnd: string;
  workStart: string;
}

export interface AlertSettings {
  adaptiveDnd: boolean;
  digestSummaries: boolean;
  focusModeOverride: boolean;
  gentleReminders: boolean;
}

export interface ProfileState {
  bio: string;
  meetingLoadThreshold: number;
  name: string;
  role: string;
}

export type FlowBlockTone = 'focus' | 'recovery' | 'meeting';

export interface FlowBlock {
  accent: string;
  description?: string;
  end: string;
  id: string;
  label?: string;
  meta: string[];
  note?: string;
  participants?: number;
  start: string;
  timeLabel: string;
  title: string;
  tone: FlowBlockTone;
}

export interface PendingTask {
  due: string;
  id: string;
  priority: string;
  title: string;
}

export interface SmartIntent {
  collaborators: string[];
  deadline: string;
  effort: string;
  energyWindow: string;
  id: string;
  priority: string;
  project: string;
  summary: string;
  tags: string[];
  title: string;
}

export interface AdaptiveProposal {
  benefit: string;
  buffer: string;
  compressedMinutes: number;
  delegatedTask: string;
  delegatedTo: string;
  from: string;
  id: string;
  overloadDetected: boolean;
  predictedScore: number;
  to: string;
}
