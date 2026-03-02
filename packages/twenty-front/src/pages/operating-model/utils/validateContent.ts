import {
  type FileNode,
  type ModelTab,
  type ValidationItem,
} from '../OperatingModelTypes';
import { type FrontmatterField, parseFrontmatter } from './frontmatterParser';

const NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const VALID_MODELS = ['sonnet', 'opus', 'haiku', 'inherit'];
const VALID_HOOK_EVENTS = [
  'PreToolUse',
  'PostToolUse',
  'Stop',
  'SubagentStop',
  'SessionStart',
  'SessionEnd',
  'UserPromptSubmit',
  'PreCompact',
  'Notification',
];
const VALID_HOOK_TYPES = ['command', 'http', 'prompt', 'agent'];
// Events where matcher is ignored
const NO_MATCHER_EVENTS = ['SessionStart', 'SessionEnd', 'Stop'];

const getField = (fields: FrontmatterField[], key: string) =>
  fields.find((f) => f.key === key);

const isBooleanString = (v: string) => v === 'true' || v === 'false';

// Shared validation for skill/command frontmatter fields
const validateSkillCommandFrontmatter = (
  fields: FrontmatterField[],
  file: FileNode,
  items: ValidationItem[],
) => {
  const nameField = getField(fields, 'name');
  if (nameField && typeof nameField.value === 'string') {
    if (!NAME_PATTERN.test(nameField.value)) {
      items.push({
        severity: 'error',
        message: `name "${nameField.value}" must be lowercase letters, numbers, and hyphens`,
        file: file.path,
        line: 2,
      });
    }
    if (nameField.value.length > 64) {
      items.push({
        severity: 'error',
        message: `name exceeds 64 characters (${nameField.value.length})`,
        file: file.path,
        line: 2,
      });
    }
  }

  if (!getField(fields, 'description')) {
    items.push({
      severity: 'warning',
      message: 'Missing description — recommended for discoverability',
      file: file.path,
      line: 2,
    });
  }

  for (const boolKey of ['disable-model-invocation', 'user-invocable']) {
    const field = getField(fields, boolKey);
    if (field && typeof field.value === 'string' && !isBooleanString(field.value)) {
      items.push({
        severity: 'error',
        message: `${boolKey} must be true or false, got "${field.value}"`,
        file: file.path,
      });
    }
  }

  const contextField = getField(fields, 'context');
  if (
    contextField &&
    typeof contextField.value === 'string' &&
    contextField.value !== 'fork'
  ) {
    items.push({
      severity: 'error',
      message: `context must be "fork" if present, got "${contextField.value}"`,
      file: file.path,
    });
  }
};

// skills/<name>/SKILL.md
const validateSkillFile = (
  file: FileNode,
  content: string,
  items: ValidationItem[],
) => {
  const parsed = parseFrontmatter(content);

  if (!parsed.hasFrontmatter) {
    items.push({
      severity: 'error',
      message: 'SKILL.md must begin with YAML frontmatter (--- … ---)',
      file: file.path,
      line: 1,
    });
    return;
  }

  validateSkillCommandFrontmatter(parsed.frontmatter, file, items);

  if (parsed.body.trim().length === 0) {
    items.push({
      severity: 'warning',
      message: 'No instruction body after frontmatter',
      file: file.path,
      line: parsed.frontmatterEndLine + 2,
    });
  }
};

// commands/*.md
const validateCommandFile = (
  file: FileNode,
  content: string,
  items: ValidationItem[],
) => {
  const parsed = parseFrontmatter(content);

  if (parsed.hasFrontmatter) {
    validateSkillCommandFrontmatter(parsed.frontmatter, file, items);
  }

  // Derive command name
  const nameField = getField(parsed.frontmatter, 'name');
  const cmdName =
    nameField && typeof nameField.value === 'string'
      ? nameField.value
      : file.name.replace(/\.md$/, '');

  if (!nameField && !NAME_PATTERN.test(cmdName)) {
    items.push({
      severity: 'warning',
      message: `Command name "${cmdName}" (from filename) should be lowercase with hyphens`,
      file: file.path,
    });
  }

  if (parsed.hasFrontmatter && parsed.body.trim().length === 0) {
    items.push({
      severity: 'warning',
      message: 'Command has no instruction body after frontmatter',
      file: file.path,
    });
  }
};

// agents/*.md
const validateAgentFile = (
  file: FileNode,
  content: string,
  items: ValidationItem[],
) => {
  const parsed = parseFrontmatter(content);

  if (!parsed.hasFrontmatter) {
    items.push({
      severity: 'error',
      message: 'Agent file must begin with YAML frontmatter (--- … ---)',
      file: file.path,
      line: 1,
    });
    return;
  }

  // Required: name
  const nameField = getField(parsed.frontmatter, 'name');
  if (!nameField) {
    items.push({
      severity: 'error',
      message: 'Missing required field: name',
      file: file.path,
      line: 2,
    });
  } else if (
    typeof nameField.value === 'string' &&
    !NAME_PATTERN.test(nameField.value)
  ) {
    items.push({
      severity: 'error',
      message: `name "${nameField.value}" must be lowercase letters and hyphens`,
      file: file.path,
      line: 2,
    });
  }

  // Required: description
  if (!getField(parsed.frontmatter, 'description')) {
    items.push({
      severity: 'error',
      message: 'Missing required field: description',
      file: file.path,
      line: 2,
    });
  }

  // Optional: model
  const modelField = getField(parsed.frontmatter, 'model');
  if (modelField && typeof modelField.value === 'string') {
    if (!VALID_MODELS.includes(modelField.value)) {
      items.push({
        severity: 'error',
        message: `model must be one of ${VALID_MODELS.join(', ')}, got "${modelField.value}"`,
        file: file.path,
      });
    }
  }

  // Body = system prompt, must exist
  if (parsed.body.trim().length === 0) {
    items.push({
      severity: 'error',
      message: 'Agent body (system prompt) must not be empty',
      file: file.path,
      line: parsed.frontmatterEndLine + 2,
    });
  }
};

// hooks/hooks.json
const validateHooksFile = (
  file: FileNode,
  content: string,
  items: ValidationItem[],
) => {
  let obj: unknown;
  try {
    obj = JSON.parse(content);
  } catch {
    items.push({
      severity: 'error',
      message: 'Invalid JSON syntax',
      file: file.path,
      line: 1,
    });
    return;
  }

  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    items.push({
      severity: 'error',
      message: 'Hooks file must be a JSON object',
      file: file.path,
    });
    return;
  }

  const root = obj as Record<string, unknown>;

  if (!('hooks' in root)) {
    items.push({
      severity: 'error',
      message: 'Missing required top-level "hooks" property',
      file: file.path,
    });
    return;
  }

  const hooks = root.hooks;

  if (typeof hooks !== 'object' || hooks === null || Array.isArray(hooks)) {
    items.push({
      severity: 'error',
      message:
        '"hooks" must be an object mapping event names to matcher-group arrays',
      file: file.path,
    });
    return;
  }

  const hooksObj = hooks as Record<string, unknown>;

  for (const [eventName, matcherGroups] of Object.entries(hooksObj)) {
    if (!VALID_HOOK_EVENTS.includes(eventName)) {
      items.push({
        severity: 'warning',
        message: `Unknown event "${eventName}"`,
        file: file.path,
      });
    }

    if (!Array.isArray(matcherGroups)) {
      items.push({
        severity: 'error',
        message: `hooks["${eventName}"] must be an array of matcher-groups`,
        file: file.path,
      });
      continue;
    }

    for (let gi = 0; gi < matcherGroups.length; gi++) {
      const group = matcherGroups[gi] as Record<string, unknown>;

      if (
        group.matcher &&
        NO_MATCHER_EVENTS.includes(eventName)
      ) {
        items.push({
          severity: 'warning',
          message: `${eventName}[${gi}]: matcher is ignored for this event`,
          file: file.path,
        });
      }

      if (!group.hooks || !Array.isArray(group.hooks)) {
        items.push({
          severity: 'error',
          message: `${eventName}[${gi}]: missing "hooks" array`,
          file: file.path,
        });
        continue;
      }

      const handlers = group.hooks as Record<string, unknown>[];

      for (let hi = 0; hi < handlers.length; hi++) {
        const handler = handlers[hi];
        const prefix = `${eventName}[${gi}].hooks[${hi}]`;

        if (!handler.type) {
          items.push({
            severity: 'error',
            message: `${prefix}: missing "type" field`,
            file: file.path,
          });
          continue;
        }

        const handlerType = handler.type as string;

        if (!VALID_HOOK_TYPES.includes(handlerType)) {
          items.push({
            severity: 'error',
            message: `${prefix}: type must be one of ${VALID_HOOK_TYPES.join(', ')}`,
            file: file.path,
          });
          continue;
        }

        switch (handlerType) {
          case 'command':
            if (!handler.command) {
              items.push({
                severity: 'error',
                message: `${prefix}: type "command" requires a "command" field`,
                file: file.path,
              });
            }
            break;
          case 'http':
            if (!handler.url) {
              items.push({
                severity: 'error',
                message: `${prefix}: type "http" requires a "url" field`,
                file: file.path,
              });
            }
            break;
          case 'prompt':
          case 'agent':
            if (!handler.prompt) {
              items.push({
                severity: 'error',
                message: `${prefix}: type "${handlerType}" requires a "prompt" field`,
                file: file.path,
              });
            }
            break;
        }
      }
    }
  }
};

export const validateFileContent = (
  file: FileNode,
  content: string,
  activeTab: ModelTab,
): ValidationItem[] => {
  const items: ValidationItem[] = [];

  if (!content.trim()) {
    items.push({
      severity: 'warning',
      message: 'File is empty',
      file: file.path,
      line: 1,
    });
    return items;
  }

  switch (activeTab) {
    case 'skills':
      if (file.format === 'md') {
        validateSkillFile(file, content, items);
      }
      break;
    case 'commands':
      if (file.format === 'md') {
        validateCommandFile(file, content, items);
      }
      break;
    case 'agents':
      if (file.format === 'md') {
        validateAgentFile(file, content, items);
      }
      break;
    case 'hooks':
      if (file.format === 'json') {
        validateHooksFile(file, content, items);
      }
      break;
  }

  return items;
};
