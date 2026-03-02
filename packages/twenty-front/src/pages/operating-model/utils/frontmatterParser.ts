export type FrontmatterArrayItem = Record<string, string | boolean>;

export type FrontmatterField = {
  key: string;
  value: string | FrontmatterArrayItem[];
};

export type ParsedContent = {
  frontmatter: FrontmatterField[];
  body: string;
  hasFrontmatter: boolean;
  frontmatterEndLine: number;
};

export const parseFrontmatter = (content: string): ParsedContent => {
  const lines = content.split('\n');

  if (lines[0]?.trim() !== '---') {
    return {
      frontmatter: [],
      body: content,
      hasFrontmatter: false,
      frontmatterEndLine: 0,
    };
  }

  let endLine = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endLine = i;
      break;
    }
  }

  if (endLine === -1) {
    return {
      frontmatter: [],
      body: content,
      hasFrontmatter: false,
      frontmatterEndLine: 0,
    };
  }

  const fmLines = lines.slice(1, endLine);
  const body = lines.slice(endLine + 1).join('\n').replace(/^\n/, '');

  const fields: FrontmatterField[] = [];
  let i = 0;

  while (i < fmLines.length) {
    const line = fmLines[i];
    const match = line.match(/^(\w[\w-]*)\s*:\s*(.*)/);
    if (match) {
      const key = match[1];
      const inlineValue = match[2].trim();

      // Check if next line starts an array
      if (i + 1 < fmLines.length && fmLines[i + 1].match(/^\s+-\s/)) {
        const items: FrontmatterArrayItem[] = [];
        i++;
        let currentItem: FrontmatterArrayItem = {};
        while (i < fmLines.length && fmLines[i].match(/^\s/)) {
          const itemLine = fmLines[i].trim();
          if (itemLine.startsWith('- ')) {
            if (Object.keys(currentItem).length > 0) {
              items.push(currentItem);
            }
            currentItem = {};
            const keyValue = itemLine.slice(2).match(/^(\w[\w-]*)\s*:\s*(.*)/);
            if (keyValue) {
              currentItem[keyValue[1]] = parseValue(keyValue[2]);
            }
          } else {
            const keyValue = itemLine.match(/^(\w[\w-]*)\s*:\s*(.*)/);
            if (keyValue) {
              currentItem[keyValue[1]] = parseValue(keyValue[2]);
            }
          }
          i++;
        }
        if (Object.keys(currentItem).length > 0) {
          items.push(currentItem);
        }
        fields.push({ key, value: items });
        continue;
      }

      fields.push({ key, value: inlineValue });
    }
    i++;
  }

  return { frontmatter: fields, body, hasFrontmatter: true, frontmatterEndLine: endLine };
};

const parseValue = (raw: string): string | boolean => {
  const cleaned = raw.replace(/^["']|["']$/g, '');
  if (cleaned === 'true') return true;
  if (cleaned === 'false') return false;
  return cleaned;
};

export const serializeFrontmatter = (parsed: ParsedContent): string => {
  if (!parsed.hasFrontmatter && parsed.frontmatter.length === 0) {
    return parsed.body;
  }

  let frontmatter = '---\n';
  for (const field of parsed.frontmatter) {
    if (Array.isArray(field.value)) {
      frontmatter += `${field.key}:\n`;
      for (const item of field.value) {
        const entries = Object.entries(item);
        if (entries.length > 0) {
          frontmatter += `  - ${entries[0][0]}: ${entries[0][1]}\n`;
          for (let j = 1; j < entries.length; j++) {
            frontmatter += `    ${entries[j][0]}: ${entries[j][1]}\n`;
          }
        }
      }
    } else {
      frontmatter += `${field.key}: ${field.value}\n`;
    }
  }
  frontmatter += '---\n';

  return frontmatter + '\n' + parsed.body;
};
