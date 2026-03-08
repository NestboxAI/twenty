import { IconCpu, IconFile, IconPlug, IconX, useIcons } from 'twenty-ui/display';
import {
  StyledContextChip,
  StyledContextChipsContainer,
  StyledRemoveContextButton,
} from '../AnalyxSharedStyles';
import {
  type CustomMcpConnector,
  type NestboxAgent,
  type SelectedContext,
} from '../AnalyxTypes';
import { formatFileSize } from '../AnalyxUtils';

type AnalyxChipsBarProps = {
  selectedContexts: SelectedContext[];
  selectedAgentIds: string[];
  files: File[];
  agents: NestboxAgent[];
  customMcpConnectors: CustomMcpConnector[];
  onRemoveContext: (id: string) => void;
  onRemoveAgent: (agentId: string) => void;
  onRemoveFile: (index: number) => void;
  onRemoveCustomMcp: (id: string) => void;
};

export const AnalyxChipsBar = ({
  selectedContexts,
  selectedAgentIds,
  files,
  agents,
  customMcpConnectors,
  onRemoveContext,
  onRemoveAgent,
  onRemoveFile,
  onRemoveCustomMcp,
}: AnalyxChipsBarProps) => {
  const { getIcon } = useIcons();

  if (
    selectedContexts.length === 0 &&
    selectedAgentIds.length === 0 &&
    files.length === 0 &&
    customMcpConnectors.length === 0
  ) {
    return null;
  }

  return (
    <StyledContextChipsContainer>
      {selectedContexts.map((ctx) => {
        const Icon = ctx.objectIcon ? (getIcon(ctx.objectIcon) ?? null) : null;
        return (
          <StyledContextChip key={ctx.id}>
            {Icon && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon size={14} />
              </div>
            )}
            <span>{ctx.name}</span>
            <StyledRemoveContextButton onClick={() => onRemoveContext(ctx.id)}>
              <IconX size={12} stroke={2.5} />
            </StyledRemoveContextButton>
          </StyledContextChip>
        );
      })}

      {selectedAgentIds.map((agentId) => {
        const agent = agents.find((a) => a.id === agentId);
        if (!agent) return null;
        return (
          <StyledContextChip key={agentId}>
            <IconCpu size={14} />
            <span>{agent.name}</span>
            <StyledRemoveContextButton onClick={() => onRemoveAgent(agentId)}>
              <IconX size={12} stroke={2.5} />
            </StyledRemoveContextButton>
          </StyledContextChip>
        );
      })}

      {customMcpConnectors.map((mcp) => (
        <StyledContextChip key={mcp.id}>
          <IconPlug size={14} />
          <span>{mcp.displayName}</span>
          <StyledRemoveContextButton onClick={() => onRemoveCustomMcp(mcp.id)}>
            <IconX size={12} stroke={2.5} />
          </StyledRemoveContextButton>
        </StyledContextChip>
      ))}

      {files.map((file, index) => {
        const previewUrl = file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : null;
        return (
          <StyledContextChip key={index}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={file.name}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 2,
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
            ) : (
              <IconFile size={14} />
            )}
            <span>
              {file.name} · {formatFileSize(file.size)}
            </span>
            <StyledRemoveContextButton onClick={() => onRemoveFile(index)}>
              <IconX size={12} stroke={2.5} />
            </StyledRemoveContextButton>
          </StyledContextChip>
        );
      })}
    </StyledContextChipsContainer>
  );
};
