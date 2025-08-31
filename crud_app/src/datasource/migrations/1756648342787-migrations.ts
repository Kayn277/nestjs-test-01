import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1756648342787 implements MigrationInterface {
    name = 'Migrations1756648342787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_663eb59bd357c71095832760ea9"`);
        await queryRunner.query(`ALTER TABLE "article" RENAME COLUMN "userUserId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_636f17dadfea1ffb4a412296a28" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_636f17dadfea1ffb4a412296a28"`);
        await queryRunner.query(`ALTER TABLE "article" RENAME COLUMN "userId" TO "userUserId"`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_663eb59bd357c71095832760ea9" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
