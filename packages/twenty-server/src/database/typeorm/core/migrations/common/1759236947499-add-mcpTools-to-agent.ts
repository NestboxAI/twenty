// nestbox: it is part upgrade to 1.7.0
import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddMcpToolsToAgent1759236947499 implements MigrationInterface {
  name = 'AddMcpToolsToAgent1759236947499';

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


