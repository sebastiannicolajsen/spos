import { MigrationInterface, QueryRunner } from "typeorm";

export class Base1666350831749 implements MigrationInterface {
    name = 'Base1666350831749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "seller" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, "transactionsId" integer, CONSTRAINT "PK_36445a9c6e794945a4a4a8d3c9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "quantity_" character varying NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "initial_value" numeric(7,2) NOT NULL DEFAULT '0', "minimum_value" numeric(7,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "price_point" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "value" numeric(7,2) NOT NULL DEFAULT '0', "productId" integer, CONSTRAINT "PK_f84710cb555b9b26532f7ae31ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cron_job" ("id" character varying NOT NULL, "event" character varying NOT NULL, "interval" character varying NOT NULL, CONSTRAINT "PK_3f180d097e1216411578b642513" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscriber" ("id" character varying NOT NULL, "javascript" character varying NOT NULL, "events_" character varying NOT NULL, "objects_" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_1c52b7ddbaf79cd2650045b79c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_products__product" ("transactionId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_723463f2f618030f67683f3fce8" PRIMARY KEY ("transactionId", "productId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_95656971366007608c7f9fbf50" ON "transaction_products__product" ("transactionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dd458c0cff2fa854cd7d156fba" ON "transaction_products__product" ("productId") `);
        await queryRunner.query(`CREATE TABLE "transaction_price_points__price_point" ("transactionId" integer NOT NULL, "pricePointId" integer NOT NULL, CONSTRAINT "PK_d7bd41137a0be7f984d23a8c65a" PRIMARY KEY ("transactionId", "pricePointId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ddb4b59a6ad7cf850750f4db87" ON "transaction_price_points__price_point" ("transactionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5b0ea073378a0baa5b6038294c" ON "transaction_price_points__price_point" ("pricePointId") `);
        await queryRunner.query(`CREATE TABLE "product_transactions_transaction" ("productId" integer NOT NULL, "transactionId" integer NOT NULL, CONSTRAINT "PK_8c7c24138e216f997d8261143b8" PRIMARY KEY ("productId", "transactionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0179d47991124bd4b8fac23f30" ON "product_transactions_transaction" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_25cccfb871f03453784eebfbf5" ON "product_transactions_transaction" ("transactionId") `);
        await queryRunner.query(`CREATE TABLE "price_point_transactions_transaction" ("pricePointId" integer NOT NULL, "transactionId" integer NOT NULL, CONSTRAINT "PK_839c99b8d673c9361283b95b371" PRIMARY KEY ("pricePointId", "transactionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_56809980e7c50850ef28568738" ON "price_point_transactions_transaction" ("pricePointId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f76d29473a88033a0b554123e9" ON "price_point_transactions_transaction" ("transactionId") `);
        await queryRunner.query(`ALTER TABLE "seller" ADD CONSTRAINT "FK_465930da363432c11d3d6d62422" FOREIGN KEY ("transactionsId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "price_point" ADD CONSTRAINT "FK_847d44f5d4282c56ee02bbb31b0" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_products__product" ADD CONSTRAINT "FK_95656971366007608c7f9fbf506" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction_products__product" ADD CONSTRAINT "FK_dd458c0cff2fa854cd7d156fba2" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction_price_points__price_point" ADD CONSTRAINT "FK_ddb4b59a6ad7cf850750f4db873" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction_price_points__price_point" ADD CONSTRAINT "FK_5b0ea073378a0baa5b6038294c9" FOREIGN KEY ("pricePointId") REFERENCES "price_point"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_transactions_transaction" ADD CONSTRAINT "FK_0179d47991124bd4b8fac23f306" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_transactions_transaction" ADD CONSTRAINT "FK_25cccfb871f03453784eebfbf5b" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "price_point_transactions_transaction" ADD CONSTRAINT "FK_56809980e7c50850ef285687382" FOREIGN KEY ("pricePointId") REFERENCES "price_point"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "price_point_transactions_transaction" ADD CONSTRAINT "FK_f76d29473a88033a0b554123e95" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "price_point_transactions_transaction" DROP CONSTRAINT "FK_f76d29473a88033a0b554123e95"`);
        await queryRunner.query(`ALTER TABLE "price_point_transactions_transaction" DROP CONSTRAINT "FK_56809980e7c50850ef285687382"`);
        await queryRunner.query(`ALTER TABLE "product_transactions_transaction" DROP CONSTRAINT "FK_25cccfb871f03453784eebfbf5b"`);
        await queryRunner.query(`ALTER TABLE "product_transactions_transaction" DROP CONSTRAINT "FK_0179d47991124bd4b8fac23f306"`);
        await queryRunner.query(`ALTER TABLE "transaction_price_points__price_point" DROP CONSTRAINT "FK_5b0ea073378a0baa5b6038294c9"`);
        await queryRunner.query(`ALTER TABLE "transaction_price_points__price_point" DROP CONSTRAINT "FK_ddb4b59a6ad7cf850750f4db873"`);
        await queryRunner.query(`ALTER TABLE "transaction_products__product" DROP CONSTRAINT "FK_dd458c0cff2fa854cd7d156fba2"`);
        await queryRunner.query(`ALTER TABLE "transaction_products__product" DROP CONSTRAINT "FK_95656971366007608c7f9fbf506"`);
        await queryRunner.query(`ALTER TABLE "price_point" DROP CONSTRAINT "FK_847d44f5d4282c56ee02bbb31b0"`);
        await queryRunner.query(`ALTER TABLE "seller" DROP CONSTRAINT "FK_465930da363432c11d3d6d62422"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f76d29473a88033a0b554123e9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_56809980e7c50850ef28568738"`);
        await queryRunner.query(`DROP TABLE "price_point_transactions_transaction"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25cccfb871f03453784eebfbf5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0179d47991124bd4b8fac23f30"`);
        await queryRunner.query(`DROP TABLE "product_transactions_transaction"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5b0ea073378a0baa5b6038294c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ddb4b59a6ad7cf850750f4db87"`);
        await queryRunner.query(`DROP TABLE "transaction_price_points__price_point"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dd458c0cff2fa854cd7d156fba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95656971366007608c7f9fbf50"`);
        await queryRunner.query(`DROP TABLE "transaction_products__product"`);
        await queryRunner.query(`DROP TABLE "subscriber"`);
        await queryRunner.query(`DROP TABLE "cron_job"`);
        await queryRunner.query(`DROP TABLE "price_point"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "seller"`);
    }

}
