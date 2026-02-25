export type TaskStatus =
  | 'Processing'
  | 'Ready'
  | 'Verified'
  | 'Done'
  | 'Reviewed'
  | 'Archived';
export type TaskTab = 'Tasks' | 'Reviewed' | 'Archive';

export interface SelectedContext {
  id: string;
  name: string;
  objectName: string;
  objectIcon?: string;
}

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
}

export type NestboxAgent = {
  id: string;
  name: string;
  description?: string;
  type?: string | null;
};

export type AnalyxSkill = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: string;
  isDefault: boolean;
};
