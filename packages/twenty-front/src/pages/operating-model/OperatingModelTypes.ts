export type ModelTab = 'overview' | 'commands' | 'skills' | 'agents' | 'hooks';

export type FileNodeType = 'file' | 'directory';

export type FileFormat = 'md' | 'json';

export type ValidationSeverity = 'error' | 'warning';

export type ValidationStatus = 'ok' | 'warning' | 'invalid';

export type ValidationItem = {
  severity: ValidationSeverity;
  message: string;
  file: string;
  line?: number;
};

export type FileNode = {
  id: string;
  name: string;
  path: string;
  type: FileNodeType;
  format?: FileFormat;
  content?: string;
  children?: FileNode[];
  required?: boolean;
  validationStatus?: ValidationStatus;
  lastEdited?: string;
};

export type RightPanelTab = 'validation' | 'reference' | 'history';

export type HookEntry = {
  event: string;
  tools?: string[];
  type: 'prompt' | 'command';
  prompt?: string;
  command?: string;
};

export type VersionChange = {
  file: string;
  action: 'added' | 'modified' | 'deleted';
  before?: string;
  after?: string;
};

export type VersionEntry = {
  id: string;
  timestamp: string;
  user: string;
  summary: string;
  status: string;
  changes: VersionChange[];
};
