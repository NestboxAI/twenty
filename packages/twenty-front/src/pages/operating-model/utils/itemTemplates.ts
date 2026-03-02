import { type FileNode, type ModelTab } from '../OperatingModelTypes';

let counter = 0;
const nextId = () => `new-${++counter}-${Date.now()}`;

const COMMAND_TEMPLATE = (name: string, description: string) => `---
name: ${name}
description: ${description}
arguments:
  - name: input
    description: Describe the input
    required: false
---

# /${name}

Instructions for the ${name} command.

## Steps

1. First step
2. Second step

## Critical Rules

- Rule 1
- Rule 2`;

const SKILL_TEMPLATE = (name: string, description: string) => `---
name: ${name}
description: ${description}
user-invocable: true
---

# ${name}

## Description

${description}

## Instructions

1. Gather relevant data
2. Analyze and process
3. Present findings

## Examples

- Example usage scenario`;

const AGENT_TEMPLATE = (name: string, description: string) => `---
name: ${name}
description: ${description}
tools: Read, Grep, Glob, Bash
model: sonnet
---

# ${name}

You are ${name}, a specialized agent that ${description.toLowerCase()}.

## Role

Describe the agent's role and responsibilities.

## Instructions

1. Understand the request
2. Gather required data
3. Process and analyze
4. Present results

## Do

- Be thorough and accurate
- Cite sources and data

## Don't

- Fabricate data
- Skip verification steps

## Output Format

Structure your output as a clear, organized report.`;

const HOOK_TEMPLATE = () => `{
  "hooks": [
    {
      "event": "PreToolUse",
      "tools": ["Write"],
      "type": "prompt",
      "prompt": "Review the content about to be written. Check for accuracy and completeness. Respond with approval or flag issues."
    }
  ]
}`;

export const createNewItem = (
  tab: ModelTab,
  name: string,
  description: string,
): FileNode => {
  switch (tab) {
    case 'commands':
      return {
        id: nextId(),
        name: `${name}.md`,
        path: `commands/${name}.md`,
        type: 'file',
        format: 'md',
        validationStatus: 'ok',
        lastEdited: new Date().toISOString(),
        content: COMMAND_TEMPLATE(name, description),
      };

    case 'skills': {
      const skillMdId = nextId();
      return {
        id: nextId(),
        name,
        path: `skills/${name}`,
        type: 'directory',
        children: [
          {
            id: skillMdId,
            name: 'SKILL.md',
            path: `skills/${name}/SKILL.md`,
            type: 'file',
            format: 'md',
            required: true,
            validationStatus: 'ok',
            lastEdited: new Date().toISOString(),
            content: SKILL_TEMPLATE(name, description),
          },
        ],
      };
    }

    case 'agents':
      return {
        id: nextId(),
        name: `${name}.md`,
        path: `agents/${name}.md`,
        type: 'file',
        format: 'md',
        validationStatus: 'ok',
        lastEdited: new Date().toISOString(),
        content: AGENT_TEMPLATE(name, description),
      };

    case 'hooks':
      return {
        id: nextId(),
        name: 'hooks.json',
        path: 'hooks/hooks.json',
        type: 'file',
        format: 'json',
        validationStatus: 'ok',
        lastEdited: new Date().toISOString(),
        content: HOOK_TEMPLATE(),
      };
  }
};

// Find the first file in a newly created node (for auto-selection)
export const findFirstFile = (node: FileNode): FileNode | null => {
  if (node.type === 'file') return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findFirstFile(child);
      if (found) return found;
    }
  }
  return null;
};

// Find the first file anywhere in a tree of nodes
export const findFirstFileInTree = (nodes: FileNode[]): FileNode | null => {
  for (const node of nodes) {
    if (node.type === 'file') return node;
    if (node.children) {
      const found = findFirstFileInTree(node.children);
      if (found) return found;
    }
  }
  return null;
};

// Determine format from file extension
const getFormat = (name: string): 'md' | 'json' | undefined => {
  if (name.endsWith('.md')) return 'md';
  if (name.endsWith('.json')) return 'json';
  return undefined;
};

// Create a bare file node
export const createBareFile = (
  name: string,
  parentPath: string | null,
): FileNode => {
  const path = parentPath ? `${parentPath}/${name}` : name;
  const format = getFormat(name);
  return {
    id: nextId(),
    name,
    path,
    type: 'file',
    format,
    validationStatus: 'ok',
    lastEdited: new Date().toISOString(),
    content: format === 'json' ? '{\n  \n}' : '',
  };
};

// Create a bare folder node
export const createBareFolder = (
  name: string,
  parentPath: string | null,
): FileNode => {
  const path = parentPath ? `${parentPath}/${name}` : name;
  return {
    id: nextId(),
    name,
    path,
    type: 'directory',
    children: [],
  };
};
