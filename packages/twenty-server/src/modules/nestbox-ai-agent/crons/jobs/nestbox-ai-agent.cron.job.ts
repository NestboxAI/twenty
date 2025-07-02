import { InjectRepository } from '@nestjs/typeorm';

import { Configuration as Config, QueryApi } from '@nestbox-ai/agents';
import { Repository } from 'typeorm';

import { AiAgentConfig } from 'src/engine/core-modules/ai-agent-config/ai-agent-config.entity';
import { AiAgentConfigStatus } from 'src/engine/core-modules/ai-agent-config/enums/ai-agent-config-status.enum';
import { SentryCronMonitor } from 'src/engine/core-modules/cron/sentry-cron-monitor.decorator';
import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { DataSourceEntity } from 'src/engine/metadata-modules/data-source/data-source.entity';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';

@Processor(MessageQueue.cronQueue)
export class NestboxAiAgentCronJob {
  constructor(
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(AiAgentConfig, 'core')
    private readonly aiAgentConfigRepository: Repository<AiAgentConfig>,
    @InjectRepository(DataSourceEntity, 'core')
    private readonly dataSourceRepository: Repository<DataSourceEntity>,
    @InjectRepository(ObjectMetadataEntity, 'core')
    private readonly objectMetadataRepository: Repository<ObjectMetadataEntity>,
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
    const cronPattern = this.twentyConfigService.get(
      'NESTBOX_AI_AGENT_CRON_PATTERN',
    );

    console.log(
      `🚀 Nestbox AI Agent cron job started with pattern: ${cronPattern}`,
    );

    try {
      await this.processCoreSchemaRecords();

      console.log('✅ Nestbox AI Agent cron job completed successfully');
    } catch (error) {
      console.error('❌ Nestbox AI Agent cron job failed', error);
      this.exceptionHandlerService.captureExceptions([error]);
    }
  }

  private async processCoreSchemaRecords(): Promise<void> {
    console.log('📊 Processing core schema records...');

    const aiAgentConfigs = await this.aiAgentConfigRepository.find({
      where: {
        status: AiAgentConfigStatus.ENABLED,
      },
    });

    console.log(`Found ${aiAgentConfigs.length} active agents in core schema`);

    for (const aiAgentConfig of aiAgentConfigs) {
      console.log(
        `Processing agent: ${aiAgentConfig.id} - ${aiAgentConfig.workspaceId}`,
      );

      try {
        // Step 1: Get schema from dataSource based on workspaceId
        const dataSource = await this.dataSourceRepository.findOne({
          where: { workspaceId: aiAgentConfig.workspaceId },
        });

        if (!dataSource) {
          console.error(
            `❌ No dataSource found for workspace: ${aiAgentConfig.workspaceId}`,
          );
          continue;
        }

        console.log(
          `📋 Found schema: ${dataSource.schema} for workspace: ${aiAgentConfig.workspaceId}`,
        );

        // Step 2: Get nameSingular from objectMetadata using objectMetadataId as id
        const objectMetadata = await this.objectMetadataRepository.findOne({
          where: { id: aiAgentConfig.objectMetadataId },
        });

        if (!objectMetadata) {
          console.error(
            `❌ No objectMetadata found for id: ${aiAgentConfig.objectMetadataId}`,
          );
          continue;
        }

        // Determine table name based on isCustom property
        const tableName = objectMetadata.isCustom
          ? `_${objectMetadata.nameSingular}`
          : objectMetadata.nameSingular;

        console.log(
          `📋 Found nameSingular: ${objectMetadata.nameSingular} (isCustom: ${objectMetadata.isCustom}) -> tableName: ${tableName} for objectMetadataId: ${aiAgentConfig.objectMetadataId}`,
        );

        // Step 3: Query the actual table using schema and tableName
        const workspaceDataSource =
          await this.twentyORMGlobalManager.getDataSourceForWorkspace({
            workspaceId: aiAgentConfig.workspaceId,
          });

        if (!workspaceDataSource) {
          console.error(
            `❌ No workspace dataSource found for workspace: ${aiAgentConfig.workspaceId}`,
          );
          continue;
        }

        // Step 4: Get field name from fieldMetadata using fieldMetadataId
        const fieldMetadataResult = await workspaceDataSource.query(
          `SELECT name FROM "core"."fieldMetadata" WHERE id = $1`,
          [aiAgentConfig.fieldMetadataId],
        );

        if (!fieldMetadataResult || fieldMetadataResult.length === 0) {
          console.error(
            `❌ No fieldMetadata found for id: ${aiAgentConfig.fieldMetadataId}`,
          );
          continue;
        }

        const fieldName = fieldMetadataResult[0].name;

        console.log(
          `📋 Found field name: ${fieldName} for fieldMetadataId: ${aiAgentConfig.fieldMetadataId}`,
        );

        // Step 5: Get current viewGroup record with position and fieldValue
        const currentViewGroupResult = await workspaceDataSource.query(
          `SELECT "fieldValue", "position" FROM "${dataSource.schema}"."viewGroup" WHERE id = $1 AND "deletedAt" IS NULL`,
          [aiAgentConfig.viewGroupId],
        );

        if (!currentViewGroupResult || currentViewGroupResult.length === 0) {
          console.error(
            `❌ No viewGroup found for id: ${aiAgentConfig.viewGroupId}`,
          );
          continue;
        }

        const currentFieldValue = currentViewGroupResult[0].fieldValue;
        const currentPosition = currentViewGroupResult[0].position;

        console.log(
          `📋 Found current position: ${currentPosition}, fieldValue: ${currentFieldValue} for viewGroupId: ${aiAgentConfig.viewGroupId}`,
        );

        // Step 6: Find next greater position in viewGroup
        const nextViewGroupResult = await workspaceDataSource.query(
          `SELECT "fieldValue", "position" FROM "${dataSource.schema}"."viewGroup" 
           WHERE "position" > $1 AND "deletedAt" IS NULL AND "fieldMetadataId" = $2
           ORDER BY "position" ASC LIMIT 1`,
          [currentPosition, aiAgentConfig.fieldMetadataId],
        );

        if (!nextViewGroupResult || nextViewGroupResult.length === 0) {
          console.log(
            `ℹ️ No next position found after position ${currentPosition}, skipping update`,
          );
          continue;
        }

        const nextFieldValue = nextViewGroupResult[0].fieldValue;
        const nextPosition = nextViewGroupResult[0].position;

        console.log(
          `📋 Found next position: ${nextPosition}, fieldValue: ${nextFieldValue}`,
        );

        // Step 7: Query records that match current fieldValue with related notes, tasks, and attachments
        const queryResult = await workspaceDataSource.query(
          `SELECT 
            main.*,
            COALESCE(json_agg(DISTINCT note.*) FILTER (WHERE note.id IS NOT NULL), '[]'::json) as notes,
            COALESCE(json_agg(DISTINCT task.*) FILTER (WHERE task.id IS NOT NULL), '[]'::json) as tasks,
            COALESCE(json_agg(DISTINCT attachment.*) FILTER (WHERE attachment.id IS NOT NULL), '[]'::json) as attachments
           FROM "${dataSource.schema}"."${tableName}" main
           LEFT JOIN "${dataSource.schema}"."noteTarget" ON "${dataSource.schema}"."noteTarget"."${objectMetadata.nameSingular}Id" = main.id
           LEFT JOIN "${dataSource.schema}"."note" ON "${dataSource.schema}"."note".id = "${dataSource.schema}"."noteTarget"."noteId"
           LEFT JOIN "${dataSource.schema}"."taskTarget" ON "${dataSource.schema}"."taskTarget"."${objectMetadata.nameSingular}Id" = main.id  
           LEFT JOIN "${dataSource.schema}"."task" ON "${dataSource.schema}"."task".id = "${dataSource.schema}"."taskTarget"."taskId"
           LEFT JOIN "${dataSource.schema}"."attachment" ON "${dataSource.schema}"."attachment"."${objectMetadata.nameSingular}Id" = main.id
           WHERE main."${fieldName}" = $1 AND main."deletedAt" IS NULL
           GROUP BY main.id
           LIMIT ${aiAgentConfig.wipLimit}`,
          [currentFieldValue],
        );

        console.log(
          `📊 Found ${queryResult.length} records to potentially update from ${currentFieldValue} to ${nextFieldValue}`,
        );

        if (queryResult.length > 0) {
          // Step 8: Initialize Nestbox AI API configuration once per agent
          const config = new Config({
            basePath: this.twentyConfigService.get('NESTBOX_AI_INSTANCE_IP'),
            baseOptions: {
              headers: {
                Authorization: this.twentyConfigService.get(
                  'NESTBOX_AI_INSTANCE_API_KEY',
                ),
              },
            },
          });

          const queryApi = new QueryApi(config);

          // Process each record individually
          for (const record of queryResult) {
            try {
              // Step 8a: Call Nestbox AI API for each record
              console.log(
                `🤖 Processing record ${record.id} with Nestbox AI agent ${aiAgentConfig.agent}`,
              );

              const queries =
                await queryApi.agentOperationsQueryControllerCreateQuery(
                  aiAgentConfig.agent,
                  {
                    params: {
                      data: record,
                      additional_agent: aiAgentConfig.additionalInput,
                    },
                  },
                );

              console.log(
                `✅ Nestbox AI query response for record ${record.id}:`,
                queries.data,
              );

              // Step 8b: Update individual record to next position's fieldValue
              await workspaceDataSource.query(
                `UPDATE "${dataSource.schema}"."${tableName}" 
                 SET "${fieldName}" = $1, "updatedAt" = NOW()
                 WHERE id = $2 AND "deletedAt" IS NULL`,
                [nextFieldValue, record.id],
              );

              console.log(
                `✅ Updated record ${record.id} from '${currentFieldValue}' to '${nextFieldValue}' in ${dataSource.schema}.${tableName}`,
              );
            } catch (error) {
              console.error(`❌ Error processing record ${record.id}:`, error);
              this.exceptionHandlerService.captureExceptions([error]);
              // Continue processing other records even if one fails
            }
          }
        } else {
          console.log(
            `ℹ️ No records found to update for ${fieldName} = '${currentFieldValue}'`,
          );
        }
      } catch (error) {
        console.error(`❌ Error processing agent ${aiAgentConfig.id}:`, error);
        this.exceptionHandlerService.captureExceptions([error]);
      }
    }
  }
}
