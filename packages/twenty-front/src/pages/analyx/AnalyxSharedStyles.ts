import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { type TaskStatus } from './AnalyxTypes';

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const StyledSpinningWrapper = styled.div`
  animation: ${spinAnimation} 1s linear infinite;
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const StyledStatusBadge = styled.div<{ status: TaskStatus }>`
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 100px;
  display: inline-flex;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  padding: 4px 8px;
  white-space: nowrap;

  ${({ status, theme }) => {
    switch (status) {
      case 'Working':
        return `color: ${theme.color.gold};`;
      case 'Ready':
      case 'Verified':
      case 'Done':
        return `color: ${theme.color.green};`;
      case 'Reviewed':
        return `color: ${theme.color.blue};`;
      case 'Archived':
        return `color: ${theme.font.color.tertiary};`;
      case 'Failed':
        return `color: ${theme.color.orange};`;
      case 'Stopped':
        return `color: ${theme.font.color.danger};`;
      default:
        return `color: ${theme.font.color.secondary};`;
    }
  }}
`;

export const StyledStatusIcon = styled.div<{ status?: TaskStatus }>`
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const StyledIconButton = styled.div`
  align-items: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  gap: 8px;
  user-select: none;
`;

export const StyledContextChipsContainer = styled.div`
  align-self: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 1100px;
  padding: 12px 0;
  width: 100%;
`;

export const StyledContextChip = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: 100px;
  color: ${({ theme }) => theme.font.color.secondary};
  display: inline-flex;
  font-size: 14px;
  gap: 4px;
  padding: 4px 8px;
`;

export const StyledRemoveContextButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-radius: 50%;
  color: ${({ theme }) => theme.font.color.tertiary};
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin-left: 2px;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.font.color.danger};
  }
`;
