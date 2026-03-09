import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('GitRemoteConnectResult')
export class GitRemoteConnectResultDto {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  publicKey?: string;

  @Field({ nullable: true })
  error?: string;
}

@ObjectType('GitSyncResult')
export class GitSyncResultDto {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  error?: string;
}
