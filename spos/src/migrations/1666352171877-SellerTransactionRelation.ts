import { MigrationInterface, QueryRunner } from "typeorm";

export class SellerTransactionRelation1666352171877 implements MigrationInterface {
    name = 'SellerTransactionRelation1666352171877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seller" DROP CONSTRAINT "FK_465930da363432c11d3d6d62422"`);
        await queryRunner.query(`ALTER TABLE "seller" DROP COLUMN "transactionsId"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "sellerId" integer`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_da429de57e23852dae37f1d182b" FOREIGN KEY ("sellerId") REFERENCES "seller"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_da429de57e23852dae37f1d182b"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "sellerId"`);
        await queryRunner.query(`ALTER TABLE "seller" ADD "transactionsId" integer`);
        await queryRunner.query(`ALTER TABLE "seller" ADD CONSTRAINT "FK_465930da363432c11d3d6d62422" FOREIGN KEY ("transactionsId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
