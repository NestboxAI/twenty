// nestbox: it is part upgrade to 1.7.0
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { Theme } from '@emotion/react';
import styled from '@emotion/styled';
import { IconChevronDown } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { type SelectOption } from 'twenty-ui/input';
import { MenuItem } from 'twenty-ui/navigation';

const StyledContainer = styled.div`
  width: 100%;
`;

const StyledLabel = styled.div`
  color: ${({ theme }: { theme: Theme }) => theme.font.color.light};
  font-size: ${({ theme }: { theme: Theme }) => theme.font.size.sm};
  font-weight: ${({ theme }: { theme: Theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }: { theme: Theme }) => theme.spacing(1)};
`;

const StyledButton = styled.button<{ disabled?: boolean }>`
  align-items: center;
  background: ${({ theme }: { theme: Theme }) => theme.background.primary};
  border: 1px solid ${({ theme }: { theme: Theme }) => theme.border.color.light};
  border-radius: ${({ theme }: { theme: Theme }) => theme.border.radius.sm};
  color: ${({ theme }: { theme: Theme }) => theme.font.color.secondary};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  font-size: ${({ theme }: { theme: Theme }) => theme.font.size.md};
  height: auto;
  justify-content: space-between;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  padding: ${({ theme }: { theme: Theme }) => `${theme.spacing(2)} ${theme.spacing(2.5)}`};
  position: relative;
  transition: all 150ms ease;
  width: 100%;

  &:hover {
    border-color: ${({ disabled, theme }: { disabled?: boolean; theme: Theme }) => 
      disabled ? theme.border.color.light : theme.border.color.medium};
  }
`;

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }: { theme: Theme }) => theme.spacing(1)};
  padding: ${({ theme }: { theme: Theme }) => theme.spacing(1)} 0;
`;

const StyledChip = styled.div`
  align-items: center;
  background: ${({ theme }: { theme: Theme }) => theme.background.tertiary};
  border-radius: ${({ theme }: { theme: Theme }) => theme.border.radius.sm};
  color: ${({ theme }: { theme: Theme }) => theme.font.color.secondary};
  display: inline-flex;
  font-size: ${({ theme }: { theme: Theme }) => theme.font.size.sm};
  gap: ${({ theme }: { theme: Theme }) => theme.spacing(1)};
  margin-right: ${({ theme }: { theme: Theme }) => theme.spacing(1)};
  max-width: calc(100% - ${({ theme }: { theme: Theme }) => theme.spacing(4)});
  padding: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledRemoveButton = styled.button<{ disabled?: boolean }>`
  align-items: center;
  background: none;
  border: none;
  color: ${({ theme }: { theme: Theme }) => theme.font.color.tertiary};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  font-size: ${({ theme }: { theme: Theme }) => theme.font.size.xs};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  padding: 0;

  &:hover {
    color: ${({ disabled, theme }: { disabled?: boolean; theme: Theme }) =>
      disabled ? theme.font.color.tertiary : theme.font.color.secondary};
  }
`;

const StyledPlaceholder = styled.span`
  color: ${({ theme }: { theme: Theme }) => theme.font.color.light};
  font-size: ${({ theme }: { theme: Theme }) => theme.font.size.md};
`;

const StyledIconContainer = styled.div`
  align-items: center;
  display: flex;
  margin-left: ${({ theme }: { theme: Theme }) => theme.spacing(1)};
`;

const StyledIconChevronDown = styled(IconChevronDown)<{ $isOpen: boolean }>`
  color: ${({ theme }: { theme: Theme }) => theme.font.color.tertiary};
  height: 20px;
  transition: transform 150ms ease;
  width: 20px;
  
  ${({ $isOpen }) => $isOpen && `
    transform: rotate(180deg);
  `}
`;

const StyledDropdownContent = styled(DropdownContent)`
  background: ${({ theme }: { theme: Theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }: { theme: Theme }) => theme.border.color.medium};
  border-radius: ${({ theme }: { theme: Theme }) => theme.border.radius.md};
  box-shadow: ${({ theme }: { theme: Theme }) => theme.boxShadow.strong};
  margin-top: ${({ theme }: { theme: Theme }) => theme.spacing(1)};
  min-width: 100%;
  padding: ${({ theme }: { theme: Theme }) => theme.spacing(1)} 0;
  position: absolute;
  z-index: 1;
`;

const StyledMenuItem = styled(MenuItem)`
  padding: ${({ theme }: { theme: Theme }) => theme.spacing(2)} ${({ theme }: { theme: Theme }) => theme.spacing(3)};
  width: 100%;

  &:hover {
    background: ${({ theme }: { theme: Theme }) => theme.background.tertiary};
  }
`;

const StyledDropdownMenuItemsContainer = styled(DropdownMenuItemsContainer)`
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: none;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }: { theme: Theme }) => theme.border.color.medium};
    border-radius: 2px;
  }
`;

type ChipMultiSelectProps = {
  options: SelectOption[];
  selectedKeys: string[];
  onChange: (selectedKeys: string[]) => void;
  label?: string;
  disabled?: boolean;
};

export const ChipMultiSelect = ({
  label,
  options,
  selectedKeys,
  onChange,
  disabled,
}: ChipMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOptions = options.filter((option) =>
    selectedKeys.includes(option.value),
  );

  const availableOptions = options.filter(
    (option) => !selectedKeys.includes(option.value),
  );

  return (
    <StyledContainer ref={containerRef}>
      {label && <StyledLabel>{label}</StyledLabel>}
      <StyledButton 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}>
        <StyledContent>
          {selectedOptions.length > 0 ? (
            <StyledChipsContainer>
              {selectedOptions.map((option) => (
                <StyledChip key={option.value}>
                  {option.label}
                  <StyledRemoveButton 
                    onClick={(e) => {
                      if (disabled) return;
                      e.stopPropagation();
                      e.preventDefault();
                      onChange(selectedKeys.filter(key => key !== option.value));
                      setIsOpen(true);
                    }}
                    disabled={disabled}
                  >
                    ×
                  </StyledRemoveButton>
                </StyledChip>
              ))}
            </StyledChipsContainer>
          ) : (
            <StyledPlaceholder>Select options...</StyledPlaceholder>
          )}
        </StyledContent>
        <StyledIconContainer>
          <StyledIconChevronDown $isOpen={isOpen} />
        </StyledIconContainer>
      </StyledButton>
      {isOpen && (
        <StyledDropdownContent>
          <StyledDropdownMenuItemsContainer hasMaxHeight>
            {availableOptions.length === 0 ? (
              <StyledMenuItem disabled text="All options selected" />
            ) : (
              availableOptions.map((option) => (
                <StyledMenuItem
                  key={option.value}
                  text={option.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange([...selectedKeys, option.value]);
                    setIsOpen(true);
                  }}
                />
              ))
            )}
          </StyledDropdownMenuItemsContainer>
        </StyledDropdownContent>
      )}
    </StyledContainer>
  );
};
