import { Field, ID, ObjectType, Query, Resolver } from '@nestjs/graphql';

import { NestboxAiService, ServiceAgent } from './nestbox-ai.service';

@ObjectType('NestboxAiAgent')
export class Agent {
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
}

@Resolver(() => Agent)
export class NestboxAiResolver {
  constructor(private readonly nestboxAiService: NestboxAiService) {}

  @Query(() => [Agent])
  async agents(): Promise<ServiceAgent[]> {
    return this.nestboxAiService.getAllAgents();
  }
}
