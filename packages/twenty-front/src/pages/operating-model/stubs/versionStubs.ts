import { type VersionEntry } from '../OperatingModelTypes';

export const VERSION_STUBS: VersionEntry[] = [
  {
    id: 'v-5',
    timestamp: '2025-12-12T16:45:00Z',
    user: 'Sarah Chen',
    summary: 'Updated IC memo command with new action argument and risk section requirements',
    status: 'Applied',
    changes: [
      {
        file: 'commands/ic-memo.md',
        action: 'modified',
        before: 'name: ic-memo\ndescription: Generate an investment committee memo',
        after: 'name: ic-memo\ndescription: Generate an investment committee memo for a deal\narguments:\n  - name: company\n    required: true\n  - name: action\n    required: false',
      },
    ],
  },
  {
    id: 'v-4',
    timestamp: '2025-12-10T14:30:00Z',
    user: 'Sarah Chen',
    summary: 'Added smart dispatcher command (/go) for natural language routing',
    status: 'Applied',
    changes: [
      {
        file: 'commands/go.md',
        action: 'added',
        after: 'name: go\ndescription: Smart dispatcher — describe what you need in plain English',
      },
    ],
  },
  {
    id: 'v-3',
    timestamp: '2025-12-08T09:15:00Z',
    user: 'Michael Torres',
    summary: 'Added fund-metrics command and fund-performance skill for PE fund analysis',
    status: 'Applied',
    changes: [
      {
        file: 'commands/fund-metrics.md',
        action: 'added',
        after: 'name: fund-metrics\ndescription: Compute IRR, TVPI, DPI, RVPI',
      },
      {
        file: 'skills/fund-performance/SKILL.md',
        action: 'added',
        after: 'name: fund-performance\ndescription: Fund performance analysis',
      },
    ],
  },
  {
    id: 'v-2',
    timestamp: '2025-12-06T12:00:00Z',
    user: 'Sarah Chen',
    summary: 'Added lifecycle hooks for financial data quality checks',
    status: 'Applied',
    changes: [
      {
        file: 'hooks/hooks.json',
        action: 'added',
        after: '4 hooks: PreToolUse quality checker, PostToolUse provenance checker, PostToolUse computation sanity, Stop completeness checker',
      },
    ],
  },
  {
    id: 'v-1',
    timestamp: '2025-12-05T11:00:00Z',
    user: 'Michael Torres',
    summary: 'Initial model setup with rent-roll command and data-aggregation skills',
    status: 'Applied',
    changes: [
      {
        file: 'commands/rent-roll.md',
        action: 'added',
        after: 'name: rent-roll\ndescription: Generate a comprehensive rent roll',
      },
      {
        file: 'skills/data-aggregation/document-parser/SKILL.md',
        action: 'added',
        after: 'name: document-parser\ndescription: Parse financial documents',
      },
      {
        file: 'skills/data-aggregation/financial-data/SKILL.md',
        action: 'added',
        after: 'name: financial-data\ndescription: Financial data extraction',
      },
      {
        file: 'agents/data-aggregator.md',
        action: 'added',
        after: 'name: data-aggregator\ndescription: Collects and normalizes data',
      },
    ],
  },
];
