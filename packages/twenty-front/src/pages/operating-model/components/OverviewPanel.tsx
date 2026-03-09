import styled from '@emotion/styled';
import {
  IconBolt,
  IconChevronRight,
  IconPlus,
  IconRobot,
  IconTerminal,
  IconWebhook,
} from 'twenty-ui/display';

import { type ModelTab } from '../OperatingModelTypes';
import { GitSyncPanel } from './GitSyncPanel';

type OverviewPanelProps = {
  workspaceName: string;
  onNavigateTab: (tab: ModelTab) => void;
  tabCounts: Record<string, number>;
};

const CATEGORY_CARDS: {
  tab: ModelTab;
  title: string;
  icon: typeof IconTerminal;
  description: string;
}[] = [
  {
    tab: 'commands',
    title: 'Control',
    icon: IconTerminal,
    description: 'Slash commands that control workspace behavior.',
  },
  {
    tab: 'skills',
    title: 'Skills',
    icon: IconBolt,
    description:
      'Reusable capabilities and prompt templates available to agents.',
  },
  {
    tab: 'agents',
    title: 'Automation',
    icon: IconRobot,
    description:
      'Autonomous agents that handle tasks and workflows automatically.',
  },
  {
    tab: 'hooks',
    title: 'Process Flows',
    icon: IconWebhook,
    description: 'Event-driven hooks that trigger actions on lifecycle events.',
  },
];

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  padding: 32px 40px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 6px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 14px;
  margin: 0 0 32px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 720px;
`;

const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);
`;

const Card = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const CardHeader = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
`;

const CardIconWrapper = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.background.tertiary};
  border-radius: 6px;
  color: ${({ theme }) => theme.font.color.secondary};
  display: flex;
  height: 32px;
  justify-content: center;
  width: 32px;
`;

const CardTitle = styled.span`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 14px;
  font-weight: 600;
`;

const CardCount = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 12px;
  margin-left: auto;
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: 13px;
  line-height: 1.45;
  margin: 0 0 16px;
`;

const CardActions = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
  margin-top: auto;
`;

const OpenButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 6px;
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-size: 12px;
  font-weight: 500;
  gap: 4px;
  padding: 5px 12px;

  &:hover {
    background: ${({ theme }) => theme.background.tertiary};
  }
`;

const AddLink = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.font.color.tertiary};
  cursor: pointer;
  display: flex;
  font-size: 12px;
  gap: 4px;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.font.color.secondary};
  }
`;

export const OverviewPanel = ({
  workspaceName,
  onNavigateTab,
  tabCounts,
}: OverviewPanelProps) => {
  return (
    <Container>
      <Title>
        Operating model for <strong>{workspaceName}</strong>
      </Title>
      <Subtitle>
        Configure commands, skills, agents, and hooks that define how your
        workspace operates.
      </Subtitle>
      <ContentWrapper>
        <Grid>
          {CATEGORY_CARDS.map(({ tab, title, icon: Icon, description }) => {
            const count = tabCounts[tab] ?? 0;
            return (
              <Card key={tab}>
                <CardHeader>
                  <CardIconWrapper>
                    <Icon size={18} />
                  </CardIconWrapper>
                  <CardTitle>{title}</CardTitle>
                  <CardCount>
                    {count} {count === 1 ? 'item' : 'items'}
                  </CardCount>
                </CardHeader>
                <CardDescription>{description}</CardDescription>
                <CardActions>
                  <OpenButton onClick={() => onNavigateTab(tab)}>
                    Open
                    <IconChevronRight size={12} />
                  </OpenButton>
                  <AddLink onClick={() => onNavigateTab(tab)}>
                    <IconPlus size={12} />
                    Add new
                  </AddLink>
                </CardActions>
              </Card>
            );
          })}
        </Grid>
        <GitSyncPanel />
      </ContentWrapper>
    </Container>
  );
};
