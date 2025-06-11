import { Command, CommandRunner } from 'nest-commander';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import {
  NESTBOX_AI_AGENT_CRON_PATTERN,
  NestboxAiAgentCronJob,
} from 'src/modules/nestbox-ai-agent/crons/jobs/nestbox-ai-agent.cron.job';

@Command({
  name: 'cron:nestbox-ai:agent',
  description: 'Starts a cron job to process records with nestbox AI agent',
})
export class NestboxAiAgentCronCommand extends CommandRunner {
  constructor(
    @InjectMessageQueue(MessageQueue.cronQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.messageQueueService.addCron<undefined>({
      jobName: NestboxAiAgentCronJob.name,
      data: undefined,
      options: {
        repeat: {
          pattern: NESTBOX_AI_AGENT_CRON_PATTERN,
        },
      },
    });
  }
} 