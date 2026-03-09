import { Field, InputType } from '@nestjs/graphql';

import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class OperatingModelFileInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  path: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  content: string;
}
