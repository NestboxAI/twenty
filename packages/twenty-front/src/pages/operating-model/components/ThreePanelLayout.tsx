import styled from '@emotion/styled';
import { type ReactNode } from 'react';
import { IconChevronLeft } from 'twenty-ui/display';

const LayoutContainer = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

const LeftPanel = styled.div<{ $collapsed: boolean }>`
  border-right: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
  width: ${({ $collapsed }) => ($collapsed ? '48px' : '260px')};
`;

const MainPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`;

const RightPanelContainer = styled.div<{ $open: boolean }>`
  border-left: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.2s ease;
  width: ${({ $open }) => ($open ? '300px' : '0px')};
`;

const CollapsedStrip = styled.div`
  align-items: center;
  border-left: 1px solid ${({ theme }) => theme.border.color.light};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: start;
  padding: 12px 0;
  width: 36px;

  &:hover {
    background: ${({ theme }) => theme.background.transparent.lighter};
  }
`;

const ExpandIcon = styled.div`
  align-items: center;
  border-radius: 50%;
  color: ${({ theme }) => theme.font.color.tertiary};
  display: flex;
  height: 20px;
  justify-content: center;
  width: 20px;
`;

const VerticalLabel = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  writing-mode: vertical-rl;
`;

type ThreePanelLayoutProps = {
  leftPanel: ReactNode;
  mainPanel: ReactNode;
  rightPanel: ReactNode;
  leftCollapsed?: boolean;
  rightOpen?: boolean;
  onToggleRight?: () => void;
};

export const ThreePanelLayout = ({
  leftPanel,
  mainPanel,
  rightPanel,
  leftCollapsed = false,
  rightOpen = false,
  onToggleRight,
}: ThreePanelLayoutProps) => {
  return (
    <LayoutContainer>
      <LeftPanel $collapsed={leftCollapsed}>{leftPanel}</LeftPanel>
      <MainPanel>{mainPanel}</MainPanel>
      {rightOpen ? (
        <RightPanelContainer $open>{rightPanel}</RightPanelContainer>
      ) : (
        <CollapsedStrip onClick={onToggleRight}>
          <ExpandIcon>
            <IconChevronLeft size={12} />
          </ExpandIcon>
          <VerticalLabel>Validation</VerticalLabel>
          <VerticalLabel>Reference</VerticalLabel>
          <VerticalLabel>History</VerticalLabel>
        </CollapsedStrip>
      )}
    </LayoutContainer>
  );
};
