import { MigrationInterface, QueryRunner } from 'typeorm';

export class Email1727481853030 implements MigrationInterface {
  name = 'Email1727481853030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "email" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "created_by" character varying(300), "updated_by" character varying(300), "message" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'initial', "status" character varying NOT NULL DEFAULT 'send', "thread_id" uuid, "subject" varchar DEFAULT 'Introduction to Our AI-Powered Solutions', CONSTRAINT "PK_1e7ed8734ee054ef18002e29b1c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "email"`);
  }
}
