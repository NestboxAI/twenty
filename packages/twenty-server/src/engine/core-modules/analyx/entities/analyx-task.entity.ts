import { Field, ObjectType } from '@nestjs/graphql';

import { IDField } from '@ptc-org/nestjs-query-graphql';
import graphqlTypeJson from 'graphql-type-json';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { WorkspaceRelatedEntity } from 'src/engine/workspace-manager/types/workspace-related-entity';

@Index('IDX_ANALYX_TASK_WORKSPACE_ID', ['workspaceId'])
@Entity({ name: 'analyxTask', schema: 'core' })
@ObjectType('AnalyxTask')
export class AnalyxTaskEntity extends WorkspaceRelatedEntity {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar' })
  name: string;

  @Field()
  @Column({ type: 'text' })
  prompt: string;

  @Field()
  @Column({ type: 'varchar', default: 'pending' })
  status: string;

  @Field(() => UUIDScalarType, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  createdById: string | null;

  @Field(() => graphqlTypeJson)
  @Column({ type: 'jsonb', nullable: false, default: '{}' })
  input: Record<string, any>;

  @Field(() => graphqlTypeJson, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  result: Record<string, any> | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  queryId: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @Field(() => UUIDScalarType, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  fileId: string | null;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
