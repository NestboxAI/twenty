import { useDropdownContextCurrentContentId } from '@/dropdown-context-state-management/hooks/useDropdownContextCurrentContentId';
import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { RecordBoardColumnHeaderAggregateDropdownComponentInstanceContext } from '@/object-record/record-board/contexts/RecordBoardColumnHeaderAggregateDropdownComponentInstanceContext';
import { useRecordGroupActions } from '@/object-record/record-group/hooks/useRecordGroupActionsNestboxAI';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { DROPDOWN_OFFSET_Y } from '@/ui/layout/dropdown/constants/DropdownOffsetY';
import { ViewType } from '@/views/types/ViewType';
import styled from '@emotion/styled';
import { useCallback } from 'react';
import { MenuItem } from 'twenty-ui/navigation';
import { LightIconButton} from 'twenty-ui/input';
import { IconDotsVertical } from 'twenty-ui/display';

const StyledContainer = styled.div`
  overflow: hidden;
`;
const StyledAIWorkflowMenuItem = styled(MenuItem)`
  div[data-testid="tooltip"] {
    font-weight: 500;
    background: linear-gradient(to right, #5a9dfb, #ff5a8d, #ffad42);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }
  
  svg {
    color: #5a9dfb;
    stroke: #5a9dfb;
  }
`;

type RecordBoardColumnDropdownMenuProps = {
  aggregateValue?: string | number;
  aggregateLabel?: string;
  objectMetadataItem: ObjectMetadataItem;
  dropdownId: string;
  handleBoardColumnMenuOpen: () => void;
  handleBoardColumnMenuClose?: () => void;
};

const MenuButton = ({
  dropdownId,
  aggregateLabel,
  handleBoardColumnMenuOpen
}: {
  dropdownId: string;
  aggregateLabel?: string;
  handleBoardColumnMenuOpen: () => void;
}) => (
  // <button
  //   type="button"
  //   data-testid="menu-button"
  //   aria-label={aggregateLabel || 'Open menu'}
  // >
      <LightIconButton
        accent="tertiary"
        Icon={IconDotsVertical}
        onClick={handleBoardColumnMenuOpen}
      />
  // </button>
);

export const RecordBoardColumnDropdownMenu = ({
  objectMetadataItem,
  aggregateValue,
  aggregateLabel,
  dropdownId,
  handleBoardColumnMenuOpen
}: RecordBoardColumnDropdownMenuProps) => {
  const {
    currentContentId,
    handleContentChange,
    handleResetContent,
    previousContentId,
  } = useDropdownContextCurrentContentId();

  const recordGroupActions = useRecordGroupActions({
    viewType: ViewType.Kanban,
  });

  const closeMenu = useCallback(() => {
    handleResetContent();
  }, [handleResetContent]);

  return (
    <RecordBoardColumnHeaderAggregateDropdownComponentInstanceContext.Provider
      value={{ instanceId: dropdownId }}
    >
      <StyledContainer>
        <Dropdown
          onClose={closeMenu}
          dropdownId={dropdownId}
          dropdownOffset={{ y: DROPDOWN_OFFSET_Y }}
          clickableComponent={
            <MenuButton
              dropdownId={dropdownId}
              aggregateLabel={aggregateLabel}
              handleBoardColumnMenuOpen={handleBoardColumnMenuOpen}
            />
          }
          dropdownComponents={
            <DropdownMenuItemsContainer>
              {recordGroupActions.map((action) => {
                const MenuItemComponent =
                  action.id === 'aiWorkflowSetup'
                    ? StyledAIWorkflowMenuItem
                    : MenuItem;
                return (
                  <MenuItemComponent
                    key={action.id}
                    onClick={() => {
                      action.callback();
                      closeMenu();
                    }}
                    LeftIcon={action.icon}
                    text={action.label}
                  />
                );
              })}
            </DropdownMenuItemsContainer>
          }
        />
      </StyledContainer>
    </RecordBoardColumnHeaderAggregateDropdownComponentInstanceContext.Provider>
  );
};
