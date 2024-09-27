import { MigrationInterface, QueryRunner } from 'typeorm';

export class Chat1727450394913 implements MigrationInterface {
  name = 'Chat1727450394913';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chat_thread" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "created_by" character varying(300), "updated_by" character varying(300), "subject_type" character varying NOT NULL, "subject_id" character varying NOT NULL, CONSTRAINT "PK_2a32fb7e7a1fd831651101fedc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "created_by" character varying(300), "updated_by" character varying(300), "message" character varying NOT NULL, "message_type" character varying NOT NULL, "meta_data" jsonb NOT NULL, "sender_name" character varying, "sender_type" character varying, "thread_id" uuid, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat" ADD CONSTRAINT "FK_2a32fb7e7a1fd831651101fedc3" FOREIGN KEY ("thread_id") REFERENCES "chat_thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat" DROP CONSTRAINT "FK_2a32fb7e7a1fd831651101fedc3"`,
    );
    await queryRunner.query(`DROP TABLE "chat"`);
    await queryRunner.query(`DROP TABLE "chat_thread"`);
  }
}
