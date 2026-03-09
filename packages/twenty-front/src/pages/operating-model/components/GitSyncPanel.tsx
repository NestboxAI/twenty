import { useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { useCallback, useState } from 'react';
import {
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconCopy,
  IconGitCommit,
  IconLink,
} from 'twenty-ui/display';

import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { GET_OPERATING_MODEL_PUBLIC_KEY } from '../graphql/operatingModelQueries';
import { useOperatingModelMutations } from '../hooks/useOperatingModelMutations';

const Panel = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const PanelHeader = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 8px;
  user-select: none;
`;

const PanelTitleText = styled.h3`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 14px;
  font-weight: 600;
  margin: 0;
`;

const PanelDescription = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 12px;
  margin-left: auto;
`;

const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionLabel = styled.label`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: 12px;
  font-weight: 500;
`;

const KeyDisplay = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 8px;
`;

const KeyTextarea = styled.textarea`
  background: ${({ theme }) => theme.background.tertiary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 4px;
  color: ${({ theme }) => theme.font.color.primary};
  flex: 1;
  font-family: 'Fira Code', 'Roboto Mono', monospace;
  font-size: 11px;
  line-height: 1.4;
  min-height: 48px;
  outline: none;
  padding: 8px;
  resize: none;
  word-break: break-all;
`;

const HelperText = styled.span`
  color: ${({ theme }) => theme.font.color.light};
  font-size: 11px;
`;

const RemoteRow = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
`;

const RemoteInput = styled.input`
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 4px;
  color: ${({ theme }) => theme.font.color.primary};
  flex: 1;
  font-size: 13px;
  outline: none;
  padding: 7px 10px;

  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
  }

  &::placeholder {
    color: ${({ theme }) => theme.font.color.light};
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  align-items: center;
  background: ${({ $variant, theme }) =>
    $variant === 'primary' ? theme.color.blue : theme.background.primary};
  border: 1px solid
    ${({ $variant, theme }) =>
      $variant === 'primary' ? theme.color.blue : theme.border.color.medium};
  border-radius: 6px;
  color: ${({ $variant, theme }) =>
    $variant === 'primary' ? 'white' : theme.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-size: 12px;
  font-weight: 500;
  gap: 4px;
  padding: 6px 12px;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const IconButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 4px;
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  display: flex;
  padding: 6px;

  &:hover {
    background: ${({ theme }) => theme.background.tertiary};
  }
`;

const SyncRow = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
`;

const ToggleWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const ToggleLabel = styled.span`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: 12px;
`;

const ToggleTrack = styled.button<{ $on: boolean }>`
  background: ${({ $on, theme }) =>
    $on ? theme.color.blue : theme.background.tertiary};
  border: 1px solid
    ${({ $on, theme }) =>
      $on ? theme.color.blue : theme.border.color.medium};
  border-radius: 12px;
  cursor: pointer;
  height: 22px;
  padding: 2px;
  position: relative;
  transition: background 0.2s, border-color 0.2s;
  width: 40px;
`;

const ToggleThumb = styled.div<{ $on: boolean }>`
  background: white;
  border-radius: 50%;
  height: 16px;
  transform: translateX(${({ $on }) => ($on ? '18px' : '0')});
  transition: transform 0.2s;
  width: 16px;
`;

const ConnectedStatus = styled.span`
  align-items: center;
  color: ${({ theme }) => theme.font.color.tertiary};
  display: flex;
  font-size: 12px;
  gap: 4px;
`;

export const GitSyncPanel = () => {
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const {
    connectRemote,
    pushToRemote,
    pullFromRemote,
    setSyncEnabled,
    loading,
  } = useOperatingModelMutations();

  const { data: keyData, loading: keyLoading } = useQuery(
    GET_OPERATING_MODEL_PUBLIC_KEY,
  );
  const publicKey = keyData?.operatingModelPublicKey as string | undefined;

  const [expanded, setExpanded] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState('');
  const [connectedUrl, setConnectedUrl] = useState<string | null>(null);
  const [syncEnabled, setSyncEnabledState] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [publicKey]);

  const handleConnect = useCallback(async () => {
    if (!remoteUrl.trim()) return;
    try {
      const result = await connectRemote(remoteUrl.trim());
      if (result?.success) {
        setConnectedUrl(remoteUrl.trim());
        enqueueSuccessSnackBar({ message: 'Remote connected' });
      } else {
        enqueueErrorSnackBar({
          message: result?.error ?? 'Failed to connect remote',
        });
      }
    } catch {
      enqueueErrorSnackBar({ message: 'Failed to connect remote' });
    }
  }, [remoteUrl, connectRemote, enqueueSuccessSnackBar, enqueueErrorSnackBar]);

  const handlePush = useCallback(
    async (force = false) => {
      try {
        const result = await pushToRemote(force);
        if (result?.success) {
          enqueueSuccessSnackBar({ message: 'Pushed to remote' });
        } else {
          enqueueErrorSnackBar({
            message: result?.error ?? 'Push failed',
          });
        }
      } catch {
        enqueueErrorSnackBar({ message: 'Push failed' });
      }
    },
    [pushToRemote, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  const handlePull = useCallback(
    async (force = false) => {
      try {
        const result = await pullFromRemote(force);
        if (result?.success) {
          enqueueSuccessSnackBar({ message: 'Pulled from remote' });
        } else {
          enqueueErrorSnackBar({
            message: result?.error ?? 'Pull failed',
          });
        }
      } catch {
        enqueueErrorSnackBar({ message: 'Pull failed' });
      }
    },
    [pullFromRemote, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  const handleToggleSync = useCallback(
    async (enabled: boolean) => {
      try {
        await setSyncEnabled(enabled);
        setSyncEnabledState(enabled);
        enqueueSuccessSnackBar({
          message: enabled ? 'Auto-sync enabled' : 'Auto-sync disabled',
        });
      } catch {
        enqueueErrorSnackBar({ message: 'Failed to update sync setting' });
      }
    },
    [setSyncEnabled, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  return (
    <Panel>
      <PanelHeader onClick={() => setExpanded((prev) => !prev)}>
        {expanded ? (
          <IconChevronDown size={14} />
        ) : (
          <IconChevronRight size={14} />
        )}
        <IconGitCommit size={16} />
        <PanelTitleText>GitHub Sync</PanelTitleText>
        <PanelDescription>
          {expanded
            ? 'Manage remote repository connection'
            : 'Connect and sync with a remote Git repository'}
        </PanelDescription>
      </PanelHeader>

      {expanded && (
        <PanelBody>
          {/* SSH Deploy Key */}
          <Section>
            <SectionLabel>SSH Deploy Key</SectionLabel>
            <KeyDisplay>
              <KeyTextarea
                readOnly
                value={
                  keyLoading
                    ? 'Loading...'
                    : publicKey ??
                      'No key available — connect a remote to generate one.'
                }
                rows={2}
              />
              <IconButton
                onClick={handleCopy}
                title="Copy to clipboard"
                disabled={!publicKey}
              >
                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
              </IconButton>
            </KeyDisplay>
            <HelperText>
              Add this key as a deploy key in your GitHub repository settings.
            </HelperText>
          </Section>

          {/* Remote Repository */}
          <Section>
            <SectionLabel>Remote Repository</SectionLabel>
            {connectedUrl && (
              <ConnectedStatus>
                <IconLink size={12} />
                Connected: {connectedUrl}
              </ConnectedStatus>
            )}
            <RemoteRow>
              <RemoteInput
                placeholder="git@github.com:org/repo.git"
                value={remoteUrl}
                onChange={(e) => setRemoteUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConnect();
                }}
              />
              <Button
                $variant="primary"
                onClick={handleConnect}
                disabled={loading.connectingRemote || !remoteUrl.trim()}
              >
                {loading.connectingRemote ? 'Connecting...' : 'Connect'}
              </Button>
            </RemoteRow>
          </Section>

          {/* Sync Actions */}
          <Section>
            <SectionLabel>Sync Actions</SectionLabel>
            <SyncRow>
              <Button
                onClick={() => handlePush()}
                disabled={loading.pushing}
              >
                <IconArrowUp size={12} />
                {loading.pushing ? 'Pushing...' : 'Push'}
              </Button>
              <Button
                onClick={() => handlePull()}
                disabled={loading.pulling}
              >
                <IconArrowDown size={12} />
                {loading.pulling ? 'Pulling...' : 'Pull'}
              </Button>
              <Button
                onClick={() => handlePush(true)}
                disabled={loading.pushing}
              >
                Force Push
              </Button>
              <Button
                onClick={() => handlePull(true)}
                disabled={loading.pulling}
              >
                Force Pull
              </Button>

              <ToggleWrapper>
                <ToggleLabel>Auto-sync</ToggleLabel>
                <ToggleTrack
                  $on={syncEnabled}
                  onClick={() => handleToggleSync(!syncEnabled)}
                >
                  <ToggleThumb $on={syncEnabled} />
                </ToggleTrack>
              </ToggleWrapper>
            </SyncRow>
          </Section>
        </PanelBody>
      )}
    </Panel>
  );
};
