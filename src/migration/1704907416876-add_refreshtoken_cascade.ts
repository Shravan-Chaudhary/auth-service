import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshtokenCascade1704907416876 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);

    await queryRunner.query(
      `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);

    await queryRunner.query(
      `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
