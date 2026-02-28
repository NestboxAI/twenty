export type StatusEvent =
  | {
      type: 'status_change';
      timestamp: string;
      message: string;
      agent?: string;
    }
  | { type: 'thinking'; timestamp: string; content: string; agent?: string }
  | { type: 'text'; timestamp: string; content: string; agent?: string }
  | {
      type: 'tool_use';
      timestamp: string;
      toolName: string;
      input: string;
      agent?: string;
    }
  | {
      type: 'tool_result';
      timestamp: string;
      toolName: string;
      output: string;
      agent?: string;
      success?: boolean;
    }
  | {
      type: 'sub_agent';
      timestamp: string;
      agentName: string;
      action: 'start' | 'end';
      parentAgent?: string;
    };

export type TaskStatus =
  | 'Processing'
  | 'Ready'
  | 'Verified'
  | 'Done'
  | 'Reviewed'
  | 'Archived';
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
  documentVersions?: DocumentVersion[];
  f1Score?: number;
  factCheckScore?: number;
  agentCount?: number;
  statusEvents?: StatusEvent[];
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
