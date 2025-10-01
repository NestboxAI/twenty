import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddMcpToolsToAgent1755000000000 implements MigrationInterface {
  name = 'AddMcpToolsToAgent1755000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."agent" ADD "mcpTools" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."agent" DROP COLUMN "mcpTools"`,
    );
  }
}


