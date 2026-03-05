export type StatusEvent = {
  type: string;
  subtype?: string;
  timestamp: string;
  sessionId?: string;
  jobId?: string;
  model?: string;
  content?: string[];
  data?: Record<string, unknown>;
  error?: string | null;
};

export type TaskStatus =
  | 'Working'
  | 'Ready'
  | 'Failed'
  | 'Verified'
  | 'Done'
  | 'Reviewed'
  | 'Archived'
  | 'Stopped';
export type TaskTab = 'Tasks' | 'Reviewed' | 'Archive';

export type DocumentVersion = {
  version: number;
  date: string;
  summary: string;
};

export interface SelectedContext {
  id: string;
  name: string;
  objectName: string;
  objectNameSingular: string;
  objectIcon?: string;
}

export type TaskRunStats = {
  durationMs?: number;
  turns?: number;
  totalCostUsd?: number;
  budgetUsd?: number;
  remainingBudgetUsd?: number;
  cumulativeSessionCostUsd?: number;
};

export type OutputFile = {
  path: string;
  sizeBytes: number;
  mimeType: string;
  content: string;
};

export interface Task {
  id: string;
  name: string;
  date: string;
  type:
    | 'ask'
    | 'document'
    | 'workflow_builder'
    | 'presentation'
    | 'task'
    | 'spreadsheet';
  entities: Array<{ name: string; objectName?: string; objectIcon?: string }>;
  attachments?: Array<{ name: string; type: string; size: number }>;
  prompt: string;
  contextType: string | null;
  version: string;
  messages: Array<{ role: 'user' | 'ai'; content: string; timestamp: number }>;
  status: TaskStatus;
  tab: TaskTab;
  documentVersions?: DocumentVersion[];
  fileId?: string | null;
  output?: string | null;
  outputFiles?: OutputFile[];
  f1Score?: number;
  factCheckScore?: number;
  runStats?: TaskRunStats;
  statusEvents?: StatusEvent[];
  errorMessage?: string | null;
}

export type NestboxAgent = {
  id: string;
  name: string;
  description?: string;
  type?: string | null;
};

export type AnalyxCommand = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: string;
  isDefault: boolean;
  placeholder?: string;
  defaultOutput?: string;
};

export type SlashCommand = {
  command: string;
  skillName: string;
  skillId: string;
  placeholder?: string;
  defaultOutput?: string;
};
