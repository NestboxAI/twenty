// nestbox: added for upgrade to 1.7.0
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { Field, ID, ObjectType, Query, Resolver } from '@nestjs/graphql';

import GraphQLJSON from 'graphql-type-json';

import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';

import { NestboxAiService, Agent as ServiceAgent } from './nestbox-ai.service';

@ObjectType('NestboxAgent')
export class NestboxAgent {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  type: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field(() => GraphQLJSON, { nullable: true })
  inputSchema?: any;
}

@ObjectType('Tool')
export class Tool {
  @Field()
  label: string;

  @Field()
  value: string;
}

@Resolver(() => NestboxAgent)
@UseGuards(WorkspaceAuthGuard)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
export class NestboxAiResolver {
  private readonly logger = new Logger(NestboxAiResolver.name);

  constructor(private readonly nestboxAiService: NestboxAiService) {}

  @Query(() => [NestboxAgent], { nullable: true })
  async agents(
    @AuthWorkspace() workspace: Workspace,
  ): Promise<ServiceAgent[] | null> {
    try {
      const agents = await this.nestboxAiService.filteredAllAgentsWithParams();

      return agents || [];
    } catch (error) {
      this.logger.error('Error in agents resolver:', error);

      return null;
    }
  }
}
