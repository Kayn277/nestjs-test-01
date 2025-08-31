import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1756635041525 implements MigrationInterface {
  name = 'Migrations1756635041525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "article" ("articleId" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "publishedAt" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userUserId" uuid, CONSTRAINT "PK_ee6426f930999e7fcba40f6c574" PRIMARY KEY ("articleId"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ee6426f930999e7fcba40f6c57" ON "article" ("articleId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(64) NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d72ea127f30e21753c9e229891" ON "user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_663eb59bd357c71095832760ea9" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_663eb59bd357c71095832760ea9"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_d72ea127f30e21753c9e229891"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "IDX_ee6426f930999e7fcba40f6c57"`);
    await queryRunner.query(`DROP TABLE "article"`);
  }
}
