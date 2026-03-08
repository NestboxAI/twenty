import { TextInput } from '@/ui/input/components/TextInput';
import { Select } from '@/ui/input/components/Select';
import styled from '@emotion/styled';
import { useState } from 'react';
import { IconX } from 'twenty-ui/display';
import { StyledIconButton } from '../AnalyxSharedStyles';
import { type CustomMcpConnector } from '../AnalyxTypes';

const StyledOverlay = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.background.transparent.medium};
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
`;

const StyledCard = styled.div`
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  box-shadow: ${({ theme }) => theme.boxShadow.strong};
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  max-width: 560px;
  width: 90%;
`;

const StyledHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  gap: 12px;
  padding: 16px 20px;
`;

const StyledTitle = styled.h2`
  color: ${({ theme }) => theme.font.color.primary};
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding: 20px;
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const StyledFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledTextarea = styled.textarea`
  background: ${({ theme }) => theme.background.transparent.lighter};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  box-sizing: border-box;
  color: ${({ theme }) => theme.font.color.primary};
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  min-height: 80px;
  padding: 10px 12px;
  resize: vertical;
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.font.color.light};
  }

  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
    outline: none;
  }
`;

const StyledFooter = styled.div`
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 20px;
`;

const StyledCancelButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;

  &:hover {
    color: ${({ theme }) => theme.font.color.primary};
  }
`;

const StyledSaveButton = styled.button<{ disabled: boolean }>`
  background: ${({ theme, disabled }) =>
    disabled ? theme.background.transparent.medium : theme.font.color.primary};
  border: none;
  border-radius: ${({ theme }) => theme.border.radius.sm};
  color: ${({ theme, disabled }) =>
    disabled ? theme.font.color.tertiary : theme.background.primary};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 14px;
  font-weight: 500;
  padding: 8px 20px;

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 1 : 0.9)};
  }
`;

const TRANSPORT_OPTIONS = [
  { value: 'http', label: 'HTTP (Streamable)' },
  { value: 'stdio', label: 'STDIO' },
  { value: 'sse', label: 'SSE' },
] as const;

const SCOPE_OPTIONS = [
  { value: 'personal', label: 'Personal' },
  { value: 'workspace', label: 'Workspace' },
] as const;

type McpConnectorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (connector: CustomMcpConnector) => void;
};

export const McpConnectorModal = ({
  isOpen,
  onClose,
  onSave,
}: McpConnectorModalProps) => {
  const [displayName, setDisplayName] = useState('');
  const [transport, setTransport] = useState<'http' | 'stdio' | 'sse'>('http');
  const [scope, setScope] = useState<'personal' | 'workspace'>('personal');
  const [description, setDescription] = useState('');

  // HTTP / SSE fields
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('');
  const [authType, setAuthType] = useState('');
  const [authValue, setAuthValue] = useState('');
  const [timeout, setTimeout_] = useState('');

  // STDIO fields
  const [command, setCommand] = useState('');
  const [args, setArgs] = useState('');
  const [envVars, setEnvVars] = useState('');
  const [workingDir, setWorkingDir] = useState('');

  if (!isOpen) return null;

  const canSave =
    displayName.trim().length > 0 &&
    ((transport === 'http' && url.trim().length > 0) ||
      (transport === 'sse' && url.trim().length > 0) ||
      (transport === 'stdio' && command.trim().length > 0));

  const resetForm = () => {
    setDisplayName('');
    setTransport('http');
    setScope('personal');
    setDescription('');
    setUrl('');
    setHeaders('');
    setAuthType('');
    setAuthValue('');
    setTimeout_('');
    setCommand('');
    setArgs('');
    setEnvVars('');
    setWorkingDir('');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const parseHeaders = (raw: string): Record<string, string> => {
    const result: Record<string, string> = {};

    for (const line of raw.split('\n')) {
      const colonIndex = line.indexOf(':');

      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();

        if (key.length > 0) result[key] = value;
      }
    }

    return result;
  };

  const handleSave = () => {
    if (!canSave) return;

    const connector: CustomMcpConnector = {
      id: crypto.randomUUID(),
      displayName: displayName.trim(),
      transport,
      scope,
      description: description.trim() || undefined,
      config: {},
    };

    if (transport === 'http') {
      connector.config = {
        url: url.trim(),
        headers: headers.trim() ? parseHeaders(headers) : undefined,
        authType: authType.trim() || undefined,
        authValue: authValue.trim() || undefined,
        timeout: timeout.trim() ? Number(timeout) : undefined,
      };
    } else if (transport === 'sse') {
      connector.config = { url: url.trim() };
    } else if (transport === 'stdio') {
      connector.config = {
        command: command.trim(),
        args: args.trim() || undefined,
        envVars: envVars.trim() || undefined,
        workingDir: workingDir.trim() || undefined,
      };
    }

    onSave(connector);
    resetForm();
    onClose();
  };

  return (
    <StyledOverlay onClick={handleOverlayClick}>
      <StyledCard>
        <StyledHeader>
          <StyledTitle>Add Custom MCP Connector</StyledTitle>
          <StyledIconButton onClick={onClose}>
            <IconX size={16} />
          </StyledIconButton>
        </StyledHeader>

        <StyledBody>
          <StyledFieldGroup>
            <StyledLabel>Display Name *</StyledLabel>
            <TextInput
              value={displayName}
              onChange={setDisplayName}
              placeholder="e.g., My Database Tools"
              fullWidth
              sizeVariant="sm"
            />
          </StyledFieldGroup>

          <StyledFieldGroup>
            <StyledLabel>Transport *</StyledLabel>
            <Select
              dropdownId="mcp-transport-select"
              value={transport}
              onChange={(val) => setTransport(val as 'http' | 'stdio' | 'sse')}
              options={[...TRANSPORT_OPTIONS]}
            />
          </StyledFieldGroup>

          <StyledFieldGroup>
            <StyledLabel>Scope</StyledLabel>
            <Select
              dropdownId="mcp-scope-select"
              value={scope}
              onChange={(val) => setScope(val as 'personal' | 'workspace')}
              options={[...SCOPE_OPTIONS]}
            />
          </StyledFieldGroup>

          <StyledFieldGroup>
            <StyledLabel>Description</StyledLabel>
            <TextInput
              value={description}
              onChange={setDescription}
              placeholder="Optional description"
              fullWidth
              sizeVariant="sm"
            />
          </StyledFieldGroup>

          {(transport === 'http' || transport === 'sse') && (
            <>
              <StyledFieldGroup>
                <StyledLabel>URL *</StyledLabel>
                <TextInput
                  value={url}
                  onChange={setUrl}
                  placeholder="https://example.com/mcp"
                  fullWidth
                  sizeVariant="sm"
                />
              </StyledFieldGroup>

              {transport === 'http' && (
                <>
                  <StyledFieldGroup>
                    <StyledLabel>Headers</StyledLabel>
                    <StyledTextarea
                      value={headers}
                      onChange={(e) => setHeaders(e.target.value)}
                      placeholder={
                        'Authorization: Bearer token123\nX-Custom: value'
                      }
                      onKeyDown={(e) => e.stopPropagation()}
                      onKeyUp={(e) => e.stopPropagation()}
                    />
                  </StyledFieldGroup>

                  <StyledFieldGroup>
                    <StyledLabel>Auth Type</StyledLabel>
                    <TextInput
                      value={authType}
                      onChange={setAuthType}
                      placeholder="e.g., Bearer, API-Key"
                      fullWidth
                      sizeVariant="sm"
                    />
                  </StyledFieldGroup>

                  <StyledFieldGroup>
                    <StyledLabel>Auth Token</StyledLabel>
                    <TextInput
                      value={authValue}
                      onChange={setAuthValue}
                      placeholder="Token value"
                      fullWidth
                      sizeVariant="sm"
                    />
                  </StyledFieldGroup>

                  <StyledFieldGroup>
                    <StyledLabel>Timeout (seconds)</StyledLabel>
                    <TextInput
                      value={timeout}
                      onChange={setTimeout_}
                      placeholder="60"
                      fullWidth
                      sizeVariant="sm"
                    />
                  </StyledFieldGroup>
                </>
              )}
            </>
          )}

          {transport === 'stdio' && (
            <>
              <StyledFieldGroup>
                <StyledLabel>Command *</StyledLabel>
                <TextInput
                  value={command}
                  onChange={setCommand}
                  placeholder="e.g., npx, python"
                  fullWidth
                  sizeVariant="sm"
                />
              </StyledFieldGroup>

              <StyledFieldGroup>
                <StyledLabel>Arguments</StyledLabel>
                <TextInput
                  value={args}
                  onChange={setArgs}
                  placeholder="e.g., -m my_mcp_server --port 8080"
                  fullWidth
                  sizeVariant="sm"
                />
              </StyledFieldGroup>

              <StyledFieldGroup>
                <StyledLabel>Environment Variables</StyledLabel>
                <StyledTextarea
                  value={envVars}
                  onChange={(e) => setEnvVars(e.target.value)}
                  placeholder={'{"API_KEY": "abc123", "DEBUG": "true"}'}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyUp={(e) => e.stopPropagation()}
                />
              </StyledFieldGroup>

              <StyledFieldGroup>
                <StyledLabel>Working Directory</StyledLabel>
                <TextInput
                  value={workingDir}
                  onChange={setWorkingDir}
                  placeholder="/path/to/working/dir"
                  fullWidth
                  sizeVariant="sm"
                />
              </StyledFieldGroup>
            </>
          )}
        </StyledBody>

        <StyledFooter>
          <StyledCancelButton onClick={onClose}>Cancel</StyledCancelButton>
          <StyledSaveButton disabled={!canSave} onClick={handleSave}>
            Save
          </StyledSaveButton>
        </StyledFooter>
      </StyledCard>
    </StyledOverlay>
  );
};
