import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('OperatingModelFile')
export class OperatingModelFileDto {
  @Field()
  path: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  format?: string;
}

@ObjectType('VersionChange')
export class VersionChangeDto {
  @Field()
  file: string;

  @Field()
  action: string;

  @Field({ nullable: true })
  before?: string;

  @Field({ nullable: true })
  after?: string;
}

@ObjectType('OperatingModelVersion')
export class OperatingModelVersionDto {
  @Field()
  id: string;

  @Field()
  timestamp: string;

  @Field()
  user: string;

  @Field()
  summary: string;

  @Field()
  status: string;

  @Field(() => [VersionChangeDto])
  changes: VersionChangeDto[];
}

@ObjectType('WorkspaceAgentStatus')
export class WorkspaceAgentStatusDto {
  @Field()
  status: string;

  @Field({ nullable: true })
  lastAppliedCommitSha?: string;

  @Field({ nullable: true })
  lastAppliedAt?: string;

  @Field({ nullable: true })
  lastAppliedByUserId?: string;

  @Field({ nullable: true })
  nestboxAgentId?: string;

  @Field({ nullable: true })
  errorMessage?: string;
}

@ObjectType('CommandArgument')
export class CommandArgumentDto {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  required: boolean;
}

@ObjectType('WorkspaceCommand')
export class WorkspaceCommandDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  body?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  placeholder?: string;

  @Field({ nullable: true })
  defaultOutput?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field(() => [CommandArgumentDto], { nullable: true })
  arguments?: CommandArgumentDto[];

  @Field({ nullable: true })
  createdAt?: string;
}

@ObjectType('OperatingModelSaveResult')
export class OperatingModelSaveResultDto {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  commitSha?: string;

  @Field({ nullable: true })
  error?: string;
}

@ObjectType('OperatingModelApplyResult')
export class OperatingModelApplyResultDto {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  commitSha?: string;

  @Field({ nullable: true })
  nestboxAgentId?: string;

  @Field({ nullable: true })
  error?: string;
}
