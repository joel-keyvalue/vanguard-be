import { MigrationInterface, QueryRunner } from 'typeorm';

export class CampaignLeads1727425168978 implements MigrationInterface {
  name = 'CampaignLeads1727425168978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "campaign" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "created_by" character varying(300), "updated_by" character varying(300), "name" character varying NOT NULL, CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaign_lead" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "created_by" character varying(300), "updated_by" character varying(300), "name" character varying NOT NULL, "email" character varying NOT NULL, "company" character varying, "job_title" character varying, "campaign_id" uuid, "status" character varying, CONSTRAINT "PK_a833f27a382bb402e83bc496d5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_lead" ADD CONSTRAINT "FK_fcc065cf8f1cb8aab4254d82349" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "campaign_lead" DROP CONSTRAINT "FK_fcc065cf8f1cb8aab4254d82349"`,
    );
    await queryRunner.query(`DROP TABLE "campaign_lead"`);
    await queryRunner.query(`DROP TABLE "campaign"`);
  }
}
