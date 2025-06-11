import { InjectRepository } from '@nestjs/typeorm';

import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { Repository } from 'typeorm';

import { SentryCronMonitor } from 'src/engine/core-modules/cron/sentry-cron-monitor.decorator';
import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';

@Processor(MessageQueue.cronQueue)
export class NestboxAiAgentCronJob {
  constructor(
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
    private readonly exceptionHandlerService: ExceptionHandlerService,
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  @Process(NestboxAiAgentCronJob.name)
  @SentryCronMonitor(
    NestboxAiAgentCronJob.name,
    '*/1 * * * *', // Default pattern for monitoring, actual pattern comes from config
  )
  async handle(): Promise<void> {
    const cronPattern = this.twentyConfigService.get('NESTBOX_AI_AGENT_CRON_PATTERN');
    
    console.log(`🚀 Nestbox AI Agent cron job started with pattern: ${cronPattern}`);

    try {
      // Process core schema records
      await this.processCoreSchemaRecords();

      // Process workspace schema records
      await this.processWorkspaceSchemaRecords();

      console.log('✅ Nestbox AI Agent cron job completed successfully');
    } catch (error) {
      console.error('❌ Nestbox AI Agent cron job failed', error);
      this.exceptionHandlerService.captureExceptions([error]);
    }
  }

  private async processCoreSchemaRecords(): Promise<void> {
    console.log('📊 Processing core schema records...');
    
    // Get active workspaces from core schema
    const activeWorkspaces = await this.workspaceRepository.find({
      where: {
        activationStatus: WorkspaceActivationStatus.ACTIVE,
      },
    });

    console.log(`Found ${activeWorkspaces.length} active workspaces in core schema`);

    // Example: Process workspace information
    for (const workspace of activeWorkspaces) {
      console.log(`Processing workspace: ${workspace.id} - ${workspace.displayName || 'Unnamed'}`);
      // Add your custom processing logic here for core schema records
    }
  }

  private async processWorkspaceSchemaRecords(): Promise<void> {
    console.log('📊 Processing workspace schema records...');
    
    // Get active workspaces from core schema
    const activeWorkspaces = await this.workspaceRepository.find({
      where: {
        activationStatus: WorkspaceActivationStatus.ACTIVE,
      },
    });

    for (const activeWorkspace of activeWorkspaces) {
      try {
        console.log(`Processing workspace schema records for workspace: ${activeWorkspace.id}`);

        // Example: Process Person records
        try {
          const personRepository = await this.twentyORMGlobalManager.getRepositoryForWorkspace(
            activeWorkspace.id,
            'person',
          );

          const persons = await personRepository.find({
            take: 10, // Limit for performance
          });

          console.log(`Found ${persons.length} person records in workspace ${activeWorkspace.id}`);
          
          // Add your custom logic here for processing Person records
          for (const person of persons) {
            console.log(`Processing person: ${person.id} - ${person.name?.firstName || 'Unnamed'} ${person.name?.lastName || ''}`);
            // Add your AI agent processing logic here
          }
        } catch (error) {
          console.error(`Error processing persons in workspace ${activeWorkspace.id}:`, error);
        }

        // Example: Process Company records
        try {
          const companyRepository = await this.twentyORMGlobalManager.getRepositoryForWorkspace(
            activeWorkspace.id,
            'company',
          );

          const companies = await companyRepository.find({
            take: 10, // Limit for performance
          });

          console.log(`Found ${companies.length} company records in workspace ${activeWorkspace.id}`);
          
          // Add your custom logic here for processing Company records
          for (const company of companies) {
            console.log(`Processing company: ${company.id} - ${company.name || 'Unnamed'}`);
            // Add your AI agent processing logic here
          }
        } catch (error) {
          console.error(`Error processing companies in workspace ${activeWorkspace.id}:`, error);
        }

      } catch (error) {
        console.error(`Error processing workspace ${activeWorkspace.id}:`, error);
        this.exceptionHandlerService.captureExceptions([error], {
          workspace: {
            id: activeWorkspace.id,
          },
        });
      }
    }
  }
} 