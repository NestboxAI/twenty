import { Field, InputType } from '@nestjs/graphql';

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import graphqlTypeJson from 'graphql-type-json';

@InputType()
export class CreateAnalyxTaskInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  prompt: string;

  @Field(() => graphqlTypeJson, { nullable: true })
  @IsOptional()
  entities?: {
    objectName: string;
    objectNameSingular?: string;
    name?: string;
    objectIcon?: string;
    id: string;
  }[];

  @Field(() => graphqlTypeJson, { nullable: true })
  @IsOptional()
  attachments?: {
    name: string;
    type: string;
    size: number;
    content?: string;
    fileId?: string;
    path?: string;
    token?: string;
  }[];

  @Field(() => graphqlTypeJson, { nullable: true })
  @IsOptional()
  agentIds?: { ip: string; apiKey: string; agentId: string }[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contextType?: string;

  @Field(() => graphqlTypeJson, { nullable: true })
  @IsOptional()
  customMcp?: {
    displayName: string;
    transport: string;
    scope: string;
    description?: string;
    config: Record<string, unknown>;
  }[];
}
