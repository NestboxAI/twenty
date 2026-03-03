import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddAnalyxTask1772000000000 implements MigrationInterface {
  name = 'AddAnalyxTask1772000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "core"."analyxTask" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "workspaceId" uuid NOT NULL,
        "name" character varying NOT NULL,
        "prompt" text NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "createdById" uuid,
        "input" jsonb NOT NULL DEFAULT '{}',
        "result" jsonb,
        "queryId" character varying,
        "errorMessage" text,
        "fileId" uuid,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_analyx_task_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ANALYX_TASK_WORKSPACE_ID" ON "core"."analyxTask" ("workspaceId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."analyxTask" ADD CONSTRAINT "FK_analyx_task_workspace_id" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."analyxTask" DROP CONSTRAINT "FK_analyx_task_workspace_id"`,
    );
    await queryRunner.query(`DROP INDEX "core"."IDX_ANALYX_TASK_WORKSPACE_ID"`);
    await queryRunner.query(`DROP TABLE "core"."analyxTask"`);
  }
}
