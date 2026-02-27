import {
  IconBrain,
  IconCheckbox,
  IconDatabase,
  IconFile,
  IconFileText,
  IconFolder,
  IconPresentation,
  IconSitemap,
  IconTable,
  IconUser,
  IconUsers,
} from 'twenty-ui/display';

export const CONTEXT_TYPE_OPTIONS = [
  'Document',
  'Presentation',
  'Spreadsheet',
  'Ask',
  'Workflow Builder',
] as const;

export const getEntityIcon = (entity: string) => {
  switch (entity) {
    case 'Project':
      return IconFolder;
    case 'Dataset':
      return IconDatabase;
    case 'Customer':
      return IconUser;
    case 'Team':
      return IconUsers;
    case 'Document':
      return IconFile;
    default:
      return IconFolder;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'document':
      return IconFileText;
    case 'presentation':
      return IconPresentation;
    case 'task':
      return IconCheckbox;
    case 'workflow_builder':
      return IconSitemap;
    case 'spreadsheet':
      return IconTable;
    default:
      return IconBrain;
  }
};

export const getTypeName = (type: string) => {
  switch (type) {
    case 'document':
      return 'Document';
    case 'presentation':
      return 'Presentation';
    case 'task':
      return 'Task';
    case 'workflow_builder':
      return 'Workflow Builder';
    case 'spreadsheet':
      return 'Spreadsheet';
    default:
      return 'Ask';
  }
};

export const getTaskType = (
  contextType: string,
):
  | 'ask'
  | 'document'
  | 'presentation'
  | 'workflow_builder'
  | 'task'
  | 'spreadsheet' => {
  const normalized = contextType.toLowerCase().replace(' ', '_');
  if (
    normalized === 'ask' ||
    normalized === 'presentation' ||
    normalized === 'document' ||
    normalized === 'workflow_builder' ||
    normalized === 'spreadsheet'
  ) {
    return normalized as
      | 'ask'
      | 'document'
      | 'workflow_builder'
      | 'presentation'
      | 'spreadsheet';
  }
  return 'document';
};

export const formatTaskDateTime = (isoOrLegacy: string): string => {
  const date = new Date(isoOrLegacy);
  if (isNaN(date.getTime())) return isoOrLegacy;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatTaskDateShort = (isoOrLegacy: string): string => {
  const date = new Date(isoOrLegacy);
  if (isNaN(date.getTime())) return isoOrLegacy;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const generateMockScores = (
  taskId: string,
): { f1: number; factCheck: number; agents: number } => {
  let hash = 0;
  for (let i = 0; i < taskId.length; i++) {
    hash = (hash * 31 + taskId.charCodeAt(i)) | 0;
  }
  const pseudoRandom = (seed: number) => Math.abs((seed * 16807) % 2147483647);
  const r1 = pseudoRandom(hash);
  const r2 = pseudoRandom(r1);
  const r3 = pseudoRandom(r2);
  return {
    f1: 65 + (r1 % 31),
    factCheck: 70 + (r2 % 26),
    agents: 2 + (r3 % 5),
  };
};

export const generateRandomTitle = (
  prompt: string,
  contextType: string,
): string => {
  const prefixes = [
    'Deep Dive:',
    'Analysis:',
    'Research:',
    'Investigation:',
    'Study:',
    'Exploration:',
    'Review:',
    'Evaluation:',
  ];
  const suffixes = [
    '- Strategic Insights',
    '- Comprehensive Report',
    '- Market Analysis',
    '- Data Review',
    '- Performance Metrics',
    '- Trend Analysis',
    '- Executive Summary',
    '- Deep Analysis',
  ];

  const words = prompt.trim().split(' ').slice(0, 4).join(' ');
  const capitalizedWords = words.charAt(0).toUpperCase() + words.slice(1);
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  if (Math.random() > 0.5) {
    return `${randomPrefix} ${capitalizedWords}`;
  }
  return `${capitalizedWords} ${randomSuffix}`;
};
