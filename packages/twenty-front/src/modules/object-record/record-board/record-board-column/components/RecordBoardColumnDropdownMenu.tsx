import styled from '@emotion/styled';
import { useCallback, useRef } from 'react';

import { useRecordGroupActions } from '@/object-record/record-group/hooks/useRecordGroupActionsNestboxAI';
import { DropdownMenu } from '@/ui/layout/dropdown/components/DropdownMenu';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { OverlayContainer } from '@/ui/layout/overlay/components/OverlayContainer';
import { useListenClickOutside } from '@/ui/utilities/pointer-event/hooks/useListenClickOutside';
import { ViewType } from '@/views/types/ViewType';
import { MenuItem } from 'twenty-ui/navigation';

const StyledMenuContainer = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing(10)};
  width: 200px;
  z-index: 1;
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
  onClose: () => void;
  onDelete?: (id: string) => void;
  stageId: string;
};

// TODO: unify and use Dropdown component
export const RecordBoardColumnDropdownMenu = ({
  onClose,
}: RecordBoardColumnDropdownMenuProps) => {
  const boardColumnMenuRef = useRef<HTMLDivElement>(null);

  const recordGroupActions = useRecordGroupActions({
    viewType: ViewType.Kanban,
  });

  const closeMenu = useCallback(() => {
    onClose();
  }, [onClose]);

  useListenClickOutside({
    refs: [boardColumnMenuRef],
    callback: closeMenu,
    listenerId: 'record-board-column-dropdown-menu',
  });

  return (
    <StyledMenuContainer ref={boardColumnMenuRef}>
      <OverlayContainer>
        <DropdownMenu data-select-disable>
          <DropdownMenuItemsContainer>
            {recordGroupActions.map((action) => {
              const MenuItemComponent = action.id === 'aiWorkflowSetup' ? StyledAIWorkflowMenuItem : MenuItem;
              
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
        </DropdownMenu>
      </OverlayContainer>
    </StyledMenuContainer>
  );
};
