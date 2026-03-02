import { type ModelTab } from '../OperatingModelTypes';

export type FieldReference = {
  name: string;
  required: boolean;
  description: string;
  example: string;
};

export type ReferenceInfo = {
  title: string;
  summary: string;
  fields: FieldReference[];
  formatHints: string[];
  examples: string[];
};

const COMMAND_REFERENCE: ReferenceInfo = {
  title: 'Command Files',
  summary:
    'Each .md file in commands/ defines a slash command. The file is split into YAML frontmatter (metadata) and a Markdown body (instructions).',
  fields: [
    {
      name: 'name',
      required: true,
      description: 'Lowercase kebab-case command identifier. Becomes the /slash-command name.',
      example: 'fund-metrics',
    },
    {
      name: 'description',
      required: true,
      description: 'One-line summary shown in the command autocomplete menu.',
      example: 'Compute IRR, TVPI, DPI, RVPI, and other fund performance metrics',
    },
    {
      name: 'arguments',
      required: false,
      description: 'List of argument objects with name, description, and required fields.',
      example: '- name: fund\\n  description: Fund name or identifier\\n  required: false',
    },
  ],
  formatHints: [
    'Filename must be kebab-case (e.g., fund-metrics.md)',
    'Frontmatter must begin and end with ---',
    'Body contains the instructions Claude follows when the command is invoked',
    'Use $ARGUMENTS in the body to reference user-supplied arguments',
  ],
  examples: [
    '---\\nname: my-command\\ndescription: A helpful command\\n---\\n\\n# /my-command\\n\\nInstructions here.',
  ],
};

const SKILL_REFERENCE: ReferenceInfo = {
  title: 'Skill Directories',
  summary:
    'Each skill is a directory under skills/ containing a required SKILL.md file plus optional supporting files (scripts, examples, references).',
  fields: [
    {
      name: 'name',
      required: false,
      description: 'Human-readable skill name. Should match the directory name.',
      example: 'fund-performance',
    },
    {
      name: 'description',
      required: true,
      description: 'Describes what the skill does. Used for skill discovery and routing.',
      example: 'Analyze fund performance metrics including IRR, multiples, and benchmarks',
    },
    {
      name: 'user-invocable',
      required: false,
      description: 'Whether users can trigger this skill directly via slash commands.',
      example: 'true',
    },
  ],
  formatHints: [
    'Directory name should be kebab-case',
    'SKILL.md is mandatory — the skill will not load without it',
    'Supporting files can be .md, .ts, .json, or any format',
    'Use subdirectories to organize complex skills',
  ],
  examples: [
    'skills/fund-performance/\\n├── SKILL.md\\n├── benchmarks.md\\n└── examples/\\n    └── sample-analysis.md',
  ],
};

const AGENT_REFERENCE: ReferenceInfo = {
  title: 'Agent Files',
  summary:
    'Each .md file in agents/ defines a specialized subagent. The frontmatter specifies metadata and capabilities, while the body serves as the system prompt.',
  fields: [
    {
      name: 'name',
      required: true,
      description: 'Agent identifier. Should match the filename.',
      example: 'data-aggregator',
    },
    {
      name: 'description',
      required: true,
      description: 'One-line description of what the agent does.',
      example: 'Collects and normalizes data from multiple sources',
    },
    {
      name: 'tools',
      required: false,
      description: 'List of tools the agent is allowed to use.',
      example: 'Read, Grep, Glob, Bash, WebFetch',
    },
    {
      name: 'model',
      required: false,
      description: 'The model to use for this agent (sonnet, opus, haiku).',
      example: 'sonnet',
    },
  ],
  formatHints: [
    'Filename must be kebab-case and match the name field',
    'Body is the system prompt — write it in second person ("You are...")',
    'Include sections: Role, Instructions, Do, Don\'t, Output Format',
    'Reference skills by name to give the agent access to specific capabilities',
  ],
  examples: [
    '---\\nname: report-assembler\\ndescription: Assembles final reports\\ntools: Read, Write, Grep\\n---\\n\\nYou are a report assembler...',
  ],
};

const HOOK_REFERENCE: ReferenceInfo = {
  title: 'Hooks Configuration',
  summary:
    'hooks.json defines lifecycle automation. Each hook fires on a specific event and can run a command or prompt-based check.',
  fields: [
    {
      name: 'event',
      required: true,
      description:
        'Lifecycle event: PreToolUse, PostToolUse, Stop, SubagentStop, SessionStart, SessionEnd, UserPromptSubmit.',
      example: 'PreToolUse',
    },
    {
      name: 'tools',
      required: false,
      description: 'Tool name matchers. If omitted, the hook fires for all tools.',
      example: '["Write", "Edit"]',
    },
    {
      name: 'type',
      required: true,
      description: 'Action type: "prompt" (AI-evaluated) or "command" (shell command).',
      example: 'prompt',
    },
    {
      name: 'prompt',
      required: false,
      description: 'The prompt text for prompt-type hooks. Evaluated by the AI to decide whether to proceed.',
      example: 'Review the content for financial accuracy...',
    },
    {
      name: 'command',
      required: false,
      description: 'Shell command to execute for command-type hooks.',
      example: 'bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh',
    },
  ],
  formatHints: [
    'File must be valid JSON with a top-level "hooks" array',
    'Use ${CLAUDE_PLUGIN_ROOT} for paths relative to plugin root',
    'Prompt-type hooks are evaluated by the AI — be specific about pass/fail criteria',
    'Command-type hooks run shell commands — ensure scripts are executable',
  ],
  examples: [
    '{"hooks": [{"event": "PreToolUse", "tools": ["Write"], "type": "prompt", "prompt": "Check content..."}]}',
  ],
};

export const REFERENCE_DATA: Record<ModelTab, ReferenceInfo> = {
  overview: {
    title: 'Overview',
    summary: 'High-level summary of your workspace operating model.',
    fields: [],
    formatHints: [],
    examples: [],
  },
  commands: COMMAND_REFERENCE,
  skills: SKILL_REFERENCE,
  agents: AGENT_REFERENCE,
  hooks: HOOK_REFERENCE,
};
