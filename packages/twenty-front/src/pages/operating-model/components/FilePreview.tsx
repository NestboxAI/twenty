import styled from '@emotion/styled';
import { useMemo } from 'react';
import { IconEye, IconFile, IconTable } from 'twenty-ui/display';
import { type FileNode, type ModelTab } from '../OperatingModelTypes';
import { parseFrontmatter } from '../utils/frontmatterParser';
import { renderMarkdownToHtml } from '../utils/renderMarkdown';

const PreviewWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SlashCommandBanner = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.background.transparent.light};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: 6px;
  display: flex;
  font-family: 'Fira Code', 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  gap: 6px;
  padding: 10px 12px;
`;

const FrontmatterCard = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: 6px;
  padding: 10px 12px;
`;

const FrontmatterRow = styled.div`
  display: flex;
  font-size: 12px;
  gap: 8px;
  padding: 3px 0;
`;

const FieldLabel = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-weight: 600;
  min-width: 80px;
`;

const FieldValue = styled.span`
  color: ${({ theme }) => theme.font.color.primary};
  flex: 1;
  word-break: break-word;
`;

const RenderedMarkdown = styled.div`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 13px;
  line-height: 1.6;

  h1 {
    font-size: 18px;
    font-weight: 700;
    margin: 16px 0 8px;
  }
  h2 {
    font-size: 15px;
    font-weight: 600;
    margin: 14px 0 6px;
  }
  h3 {
    font-size: 13px;
    font-weight: 600;
    margin: 12px 0 4px;
  }
  p {
    margin: 4px 0;
  }
  strong {
    font-weight: 600;
  }
  code {
    background: ${({ theme }) => theme.background.tertiary};
    border-radius: 3px;
    font-family: 'Fira Code', monospace;
    font-size: 12px;
    padding: 1px 4px;
  }
  ul {
    margin: 4px 0;
    padding-left: 20px;
  }
  li {
    margin: 2px 0;
  }
  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.border.color.light};
    margin: 12px 0;
  }
`;

const SupportingFilesList = styled.div`
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: 6px;
`;

const SupportingFileRow = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  font-size: 12px;
  gap: 6px;
  padding: 6px 10px;

  &:last-child {
    border-bottom: none;
  }
`;

const SupportingFileName = styled.span`
  color: ${({ theme }) => theme.font.color.primary};
  font-family: 'Fira Code', monospace;
  font-size: 11px;
`;

const SectionLabel = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 11px;
  font-weight: 600;
  margin-top: 8px;
  text-transform: uppercase;
`;

const HookMatrixTable = styled.table`
  border-collapse: collapse;
  font-size: 12px;
  width: 100%;

  th,
  td {
    border: 1px solid ${({ theme }) => theme.border.color.light};
    padding: 6px 8px;
    text-align: left;
  }

  th {
    background: ${({ theme }) => theme.background.secondary};
    color: ${({ theme }) => theme.font.color.secondary};
    font-weight: 600;
  }
`;

const HookPromptSnippet = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 11px;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.font.color.light};
  display: flex;
  flex: 1;
  font-size: 12px;
  justify-content: center;
  padding: 32px;
  text-align: center;
`;

type HookEntry = {
  event: string;
  tools?: string[];
  type: string;
  prompt?: string;
  command?: string;
};

type FilePreviewProps = {
  activeTab: ModelTab;
  selectedFile: FileNode | null;
  content: string;
  nodes: FileNode[];
};

export const FilePreview = ({
  activeTab,
  selectedFile,
  content,
  nodes,
}: FilePreviewProps) => {
  const parsed = useMemo(() => parseFrontmatter(content), [content]);
  const bodyHtml = useMemo(
    () => renderMarkdownToHtml(parsed.body),
    [parsed.body],
  );

  if (!selectedFile) {
    return (
      <EmptyState>
        <IconEye size={20} style={{ marginBottom: 4 }} />
        Select a file to preview
      </EmptyState>
    );
  }

  // Hooks: render hook matrix table
  if (activeTab === 'hooks' && selectedFile.format === 'json') {
    return <HookMatrixPreview content={content} />;
  }

  // Commands: show derived slash command + frontmatter card + rendered body
  if (activeTab === 'commands') {
    const commandName = selectedFile.name.replace('.md', '');
    return (
      <PreviewWrap>
        <SlashCommandBanner>/{commandName}</SlashCommandBanner>
        {parsed.hasFrontmatter && (
          <FrontmatterSummary fields={parsed.frontmatter} />
        )}
        <RenderedMarkdown dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </PreviewWrap>
    );
  }

  // Skills: show rendered SKILL.md + supporting files
  if (activeTab === 'skills') {
    const supportingFiles = findSupportingFiles(selectedFile, nodes);
    return (
      <PreviewWrap>
        {parsed.hasFrontmatter && (
          <FrontmatterSummary fields={parsed.frontmatter} />
        )}
        <RenderedMarkdown dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        {supportingFiles.length > 0 && (
          <>
            <SectionLabel>Supporting Files</SectionLabel>
            <SupportingFilesList>
              {supportingFiles.map((supportingFile) => (
                <SupportingFileRow key={supportingFile.id}>
                  <IconFile size={12} />
                  <SupportingFileName>
                    {supportingFile.name}
                  </SupportingFileName>
                </SupportingFileRow>
              ))}
            </SupportingFilesList>
          </>
        )}
      </PreviewWrap>
    );
  }

  // Agents: frontmatter card + rendered prompt
  if (activeTab === 'agents') {
    return (
      <PreviewWrap>
        {parsed.hasFrontmatter && (
          <FrontmatterSummary fields={parsed.frontmatter} />
        )}
        <SectionLabel>System Prompt</SectionLabel>
        <RenderedMarkdown dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </PreviewWrap>
    );
  }

  // Fallback
  return (
    <RenderedMarkdown dangerouslySetInnerHTML={{ __html: bodyHtml }} />
  );
};

const FrontmatterSummary = ({
  fields,
}: {
  fields: { key: string; value: string | Record<string, string | boolean>[] }[];
}) => (
  <FrontmatterCard>
    {fields.map((field) => (
      <FrontmatterRow key={field.key}>
        <FieldLabel>{field.key}</FieldLabel>
        <FieldValue>
          {typeof field.value === 'string'
            ? field.value
            : `${field.value.length} item${field.value.length !== 1 ? 's' : ''}`}
        </FieldValue>
      </FrontmatterRow>
    ))}
  </FrontmatterCard>
);

const HookMatrixPreview = ({ content }: { content: string }) => {
  const hooks = useMemo<HookEntry[]>(() => {
    try {
      const obj = JSON.parse(content);
      return Array.isArray(obj.hooks) ? obj.hooks : [];
    } catch {
      return [];
    }
  }, [content]);

  if (hooks.length === 0) {
    return (
      <EmptyState>
        <IconTable size={20} style={{ marginBottom: 4 }} />
        No hooks defined or invalid JSON
      </EmptyState>
    );
  }

  return (
    <PreviewWrap>
      <SectionLabel>Hook Matrix</SectionLabel>
      <HookMatrixTable>
        <thead>
          <tr>
            <th>Event</th>
            <th>Matchers</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {hooks.map((hook, index) => (
            <tr key={index}>
              <td>{hook.event}</td>
              <td>{hook.tools?.join(', ') || '(all)'}</td>
              <td>{hook.type}</td>
              <td>
                <HookPromptSnippet>
                  {hook.prompt
                    ? hook.prompt.slice(0, 80) + (hook.prompt.length > 80 ? '...' : '')
                    : hook.command ?? '—'}
                </HookPromptSnippet>
              </td>
            </tr>
          ))}
        </tbody>
      </HookMatrixTable>
    </PreviewWrap>
  );
};

// Find sibling files in the same directory for a selected skill file
const findSupportingFiles = (
  selectedFile: FileNode,
  nodes: FileNode[],
): FileNode[] => {
  const findParent = (
    nodeList: FileNode[],
    targetId: string,
  ): FileNode | null => {
    for (const node of nodeList) {
      if (node.children?.some((child) => child.id === targetId)) {
        return node;
      }
      if (node.children) {
        const found = findParent(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const parent = findParent(nodes, selectedFile.id);
  if (!parent?.children) return [];

  return parent.children.filter(
    (child) => child.type === 'file' && child.id !== selectedFile.id,
  );
};
