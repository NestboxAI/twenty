import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAiAgentConfigTable1749321615327 implements MigrationInterface {
    name = 'CreateAiAgentConfigTable1749321615327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "core"."aiAgentConfig_status_enum" AS ENUM('ENABLED', 'DISABLED')`);
        await queryRunner.query(`CREATE TABLE "core"."aiAgentConfig" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workspaceId" uuid NOT NULL, "objectMetadataId" uuid, "viewId" uuid, "fieldMetadataId" uuid, "viewGroupId" uuid, "agent" text NOT NULL, "wipLimit" integer NOT NULL DEFAULT '3', "additionalInput" character varying(5000), "status" "core"."aiAgentConfig_status_enum" NOT NULL DEFAULT 'ENABLED', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_29b4dda759be5042e0b007f8345" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "core"."aiAgentConfig"`);
        await queryRunner.query(`DROP TYPE "core"."aiAgentConfig_status_enum"`);
    }

}
