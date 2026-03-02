import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import { type SlashCommand } from '../AnalyxTypes';

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledPopup = styled.div<{ $top: number; $left: number }>`
  animation: ${slideDown} 0.12s ease-out;
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.boxShadow.strong};
  left: ${({ $left }) => $left}px;
  max-width: 480px;
  min-width: 340px;
  overflow: hidden;
  position: absolute;
  top: ${({ $top }) => $top}px;
  z-index: 10;
`;

const StyledHeader = styled.div`
  padding: 4px 10px 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.font.color.tertiary};
`;

const StyledCommandList = styled.div`
  padding: 2px 0;
`;

const StyledCommandItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  cursor: pointer;
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.background.tertiary : 'transparent'};
  transition: background 0.08s ease;

  &:hover {
    background: ${({ theme }) => theme.background.tertiary};
  }
`;

const StyledCommandSlug = styled.span`
  font-family: 'Fira Code', 'Roboto Mono', 'SF Mono', 'Fira Mono', monospace;
  font-size: 11px;
  color: ${({ theme }) => theme.font.color.primary};
  white-space: nowrap;
`;

const StyledCommandName = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledFooter = styled.div`
  padding: 6px 12px;
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.font.color.tertiary};
`;

const StyledKbd = styled.kbd`
  background: ${({ theme }) => theme.background.tertiary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: 3px;
  color: ${({ theme }) => theme.font.color.secondary};
  display: inline-block;
  font-family: inherit;
  font-size: 11px;
  padding: 1px 5px;
`;

type SlashCommandPopupProps = {
  commands: SlashCommand[];
  selectedIndex: number;
  onSelect: (cmd: SlashCommand) => void;
  top: number;
  left: number;
};

export const SlashCommandPopup = ({
  commands,
  selectedIndex,
  onSelect,
  top,
  left,
}: SlashCommandPopupProps) => {
  if (commands.length === 0) return null;

  return (
    <StyledPopup $top={top} $left={left}>
      <StyledHeader>Commands</StyledHeader>
      <StyledCommandList>
        {commands.map((cmd, index) => (
          <StyledCommandItem
            key={cmd.skillId}
            $isSelected={index === selectedIndex}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(cmd);
            }}
          >
            <StyledCommandSlug>/{cmd.command}</StyledCommandSlug>
            <StyledCommandName>{cmd.skillName}</StyledCommandName>
          </StyledCommandItem>
        ))}
      </StyledCommandList>
      <StyledFooter>
        <StyledKbd>Tab</StyledKbd> or <StyledKbd>Enter</StyledKbd> to select
        <span style={{ margin: '0 2px' }}>&middot;</span>
        <StyledKbd>Esc</StyledKbd> to dismiss
      </StyledFooter>
    </StyledPopup>
  );
};
