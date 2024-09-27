import { MigrationInterface, QueryRunner } from "typeorm";

export class ScheduleTime1727455880417 implements MigrationInterface {
    name = 'ScheduleTime1727455880417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign" ADD "schedule_time" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD "status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP COLUMN "schedule_time"`);
    }

}
