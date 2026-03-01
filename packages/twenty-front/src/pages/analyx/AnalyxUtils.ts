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
import { type StatusEvent, type TokenUsage } from './AnalyxTypes';

export const slugifySkillName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

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
  return (
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ' at ' +
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  );
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

export const generateMockTokenUsage = (
  taskId: string,
  agentCount: number,
): TokenUsage => {
  let hash = 0;
  for (let i = 0; i < taskId.length; i++) {
    hash = (hash * 37 + taskId.charCodeAt(i)) | 0;
  }
  const pseudoRandom = (seed: number) => Math.abs((seed * 16807) % 2147483647);

  const agentNames = [
    'orchestrator',
    'data_collector',
    'fact_checker',
    'analyst',
    'report_writer',
    'validator',
  ];

  let totalInput = 0;
  let totalOutput = 0;
  const agentBreakdown: TokenUsage['agentBreakdown'] = [];
  let r = pseudoRandom(hash + 7);

  for (let i = 0; i < agentCount; i++) {
    r = pseudoRandom(r);
    const input = 8000 + (r % 42000);
    r = pseudoRandom(r);
    const output = 2000 + (r % 18000);
    totalInput += input;
    totalOutput += output;
    agentBreakdown.push({
      agentName: agentNames[i % agentNames.length],
      inputTokens: input,
      outputTokens: output,
    });
  }

  r = pseudoRandom(r);
  const durationSeconds = 45 + (r % 170);

  return {
    inputTokens: totalInput,
    outputTokens: totalOutput,
    totalTokens: totalInput + totalOutput,
    agentBreakdown,
    durationSeconds,
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

export const formatRelativeTimestamp = (
  isoDate: string,
  baseDate: string,
): string => {
  const delta = Math.max(
    0,
    Math.floor(
      (new Date(isoDate).getTime() - new Date(baseDate).getTime()) / 1000,
    ),
  );
  const minutes = Math.floor(delta / 60);
  const seconds = delta % 60;
  return `+${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const generateMockStatusEvents = (
  taskId: string,
  prompt: string,
): StatusEvent[] => {
  let hash = 0;
  for (let i = 0; i < taskId.length; i++) {
    hash = (hash * 31 + taskId.charCodeAt(i)) | 0;
  }
  const pseudoRandom = (seed: number) => Math.abs((seed * 16807) % 2147483647);

  const words = prompt.trim().split(/\s+/).filter(Boolean);
  const topicWord =
    words.length > 1 ? words.slice(0, 3).join(' ') : 'the topic';

  const toolNames = [
    'web_search',
    'database_query',
    'document_analysis',
    'fact_check',
  ];
  const r1 = pseudoRandom(hash);
  const r2 = pseudoRandom(r1);
  const r3 = pseudoRandom(r2);
  const r4 = pseudoRandom(r3);

  const tool1 = toolNames[r1 % toolNames.length];
  const tool2 = toolNames[r2 % toolNames.length];
  const tool3 = toolNames[r3 % toolNames.length];

  const baseTime = new Date(0).getTime();
  const ts = (seconds: number) =>
    new Date(baseTime + seconds * 1000).toISOString();

  // Extra events based on hash for variety (12-18 events)
  const extraThinking = r4 % 3 > 0;
  const extraTool = r2 % 4 > 1;

  const events: StatusEvent[] = [
    { type: 'status_change', timestamp: ts(0), message: 'Research initiated' },
    {
      type: 'thinking',
      timestamp: ts(2 + (r1 % 3)),
      content: `Analyzing the user's request about ${topicWord}. I need to gather relevant data and verify claims before producing a comprehensive report. Let me start by searching for the most recent information available.`,
    },
    {
      type: 'tool_use',
      timestamp: ts(5 + (r2 % 4)),
      toolName: tool1,
      input: `"${topicWord}" latest analysis ${2024 + (r1 % 2)}`,
    },
    {
      type: 'tool_result',
      timestamp: ts(12 + (r3 % 6)),
      toolName: tool1,
      output: `Found ${8 + (r2 % 12)} relevant results including market reports, industry analyses, and recent publications.`,
      success: true,
    },
    {
      type: 'thinking',
      timestamp: ts(14 + (r1 % 3)),
      content: `Processing search results. Several key findings are emerging around ${topicWord}. I should cross-reference these with additional data sources to ensure accuracy.`,
    },
    {
      type: 'sub_agent',
      timestamp: ts(18 + (r4 % 5)),
      agentName: 'fact_checker',
      action: 'start',
      parentAgent: 'main',
    },
    {
      type: 'tool_use',
      timestamp: ts(20 + (r3 % 4)),
      toolName: tool3,
      input: `Verifying claims against ${3 + (r4 % 5)} primary sources`,
      agent: 'fact_checker',
    },
    {
      type: 'tool_result',
      timestamp: ts(35 + (r1 % 10)),
      toolName: tool3,
      output: `All ${8 + (r3 % 8)} claims verified. ${1 + (r2 % 3)} claim(s) required minor corrections.`,
      success: true,
      agent: 'fact_checker',
    },
    {
      type: 'sub_agent',
      timestamp: ts(38 + (r2 % 5)),
      agentName: 'fact_checker',
      action: 'end',
      parentAgent: 'main',
    },
  ];

  if (extraThinking) {
    events.push({
      type: 'thinking',
      timestamp: ts(40 + (r3 % 4)),
      content: `Integrating verified data with the initial findings. The fact-checker has confirmed most claims. Now synthesizing the final report structure.`,
    });
  }

  if (extraTool) {
    events.push(
      {
        type: 'tool_use',
        timestamp: ts(44 + (r1 % 5)),
        toolName: tool2,
        input: `Querying internal data for ${topicWord} benchmarks`,
      },
      {
        type: 'tool_result',
        timestamp: ts(52 + (r4 % 8)),
        toolName: tool2,
        output: `Retrieved ${5 + (r3 % 10)} benchmark records matching the criteria.`,
        success: r4 % 7 !== 0,
      },
    );
  }

  events.push(
    {
      type: 'text',
      timestamp: ts(60 + (r2 % 20)),
      content: `Based on the analysis, the key findings regarding ${topicWord} indicate significant trends. The data has been cross-referenced with ${3 + (r1 % 4)} independent sources and all major claims have been verified.`,
    },
    {
      type: 'text',
      timestamp: ts(120 + (r3 % 40)),
      content:
        'Report generation complete. All sections have been formatted and citations added.',
    },
    {
      type: 'status_change',
      timestamp: ts(185 + (r4 % 30)),
      message: 'Research completed',
    },
  );

  // Sort by timestamp to ensure correct order after conditional additions
  events.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return events;
};
