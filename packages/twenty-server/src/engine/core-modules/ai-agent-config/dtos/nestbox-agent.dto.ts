import { Field, ObjectType } from '@nestjs/graphql';

import { IsNotEmpty, IsString } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@ObjectType('NestboxAgent')
export class NestboxAgentDTO {
  @IsString()
  @IsNotEmpty()
  @Field()
  id: string;

  @IsString()
  @Field()
  name: string;

  @IsString()
  @Field({ nullable: true })
  description?: string;

  @IsString()
  @Field()
  type: string;

  @Field(() => GraphQLJSON, { nullable: true })
  inputSchema?: object;
}
