import { MigrationInterface, QueryRunner } from "typeorm";

export class Base1664809722269 implements MigrationInterface {
    name = 'Base1664809722269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "seller" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, "transactionsId" integer, CONSTRAINT "PK_36445a9c6e794945a4a4a8d3c9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "initial_value" integer NOT NULL, "minimum_value" integer NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "price_point" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "value" integer NOT NULL, "productId" integer, CONSTRAINT "PK_f84710cb555b9b26532f7ae31ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transformation" ("id" SERIAL NOT NULL, "js" character varying NOT NULL, "event_id" character varying NOT NULL, CONSTRAINT "PK_316e45255f41ca2f050a14ac900" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_product_product" ("transactionId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_7d5e0357bdca6b9c0fc0cdd88ea" PRIMARY KEY ("transactionId", "productId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d56cf0ee79b6fb78c7ab8db379" ON "transaction_product_product" ("transactionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cbcd32c22772881f4bc084aabd" ON "transaction_product_product" ("productId") `);
        await queryRunner.query(`CREATE TABLE "transaction_price_points_price_point" ("transactionId" integer NOT NULL, "pricePointId" integer NOT NULL, CONSTRAINT "PK_9ed778e47838ac232cc07d2c6a4" PRIMARY KEY ("transactionId", "pricePointId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_291b42c8bea202db2a92e258a6" ON "transaction_price_points_price_point" ("transactionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b1b31069b04f28a3026e6db725" ON "transaction_price_points_price_point" ("pricePointId") `);
        await queryRunner.query(`CREATE TABLE "product_transactions_transaction" ("productId" integer NOT NULL, "transactionId" integer NOT NULL, CONSTRAINT "PK_8c7c24138e216f997d8261143b8" PRIMARY KEY ("productId", "transactionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0179d47991124bd4b8fac23f30" ON "product_transactions_transaction" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_25cccfb871f03453784eebfbf5" ON "product_transactions_transaction" ("transactionId") `);
        await queryRunner.query(`CREATE TABLE "price_point_transactions_transaction" ("pricePointId" integer NOT NULL, "transactionId" integer NOT NULL, CONSTRAINT "PK_839c99b8d673c9361283b95b371" PRIMARY KEY ("pricePointId", "transactionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_56809980e7c50850ef28568738" ON "price_point_transactions_transaction" ("pricePointId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f76d29473a88033a0b554123e9" ON "price_point_transactions_transaction" ("transactionId") `);
        await queryRunner.query(`ALTER TABLE "seller" ADD CONSTRAINT "FK_465930da363432c11d3d6d62422" FOREIGN KEY ("transactionsId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "price_point" ADD CONSTRAINT "FK_847d44f5d4282c56ee02bbb31b0" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_product_product" ADD CONSTRAINT "FK_d56cf0ee79b6fb78c7ab8db3792" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction_product_product" ADD CONSTRAINT "FK_cbcd32c22772881f4bc084aabd4" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction_price_points_price_point" ADD CONSTRAINT "FK_291b42c8bea202db2a92e258a68" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction_price_points_price_point" ADD CONSTRAINT "FK_b1b31069b04f28a3026e6db725f" FOREIGN KEY ("pricePointId") REFERENCES "price_point"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
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
        await queryRunner.query(`ALTER TABLE "transaction_price_points_price_point" DROP CONSTRAINT "FK_b1b31069b04f28a3026e6db725f"`);
        await queryRunner.query(`ALTER TABLE "transaction_price_points_price_point" DROP CONSTRAINT "FK_291b42c8bea202db2a92e258a68"`);
        await queryRunner.query(`ALTER TABLE "transaction_product_product" DROP CONSTRAINT "FK_cbcd32c22772881f4bc084aabd4"`);
        await queryRunner.query(`ALTER TABLE "transaction_product_product" DROP CONSTRAINT "FK_d56cf0ee79b6fb78c7ab8db3792"`);
        await queryRunner.query(`ALTER TABLE "price_point" DROP CONSTRAINT "FK_847d44f5d4282c56ee02bbb31b0"`);
        await queryRunner.query(`ALTER TABLE "seller" DROP CONSTRAINT "FK_465930da363432c11d3d6d62422"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f76d29473a88033a0b554123e9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_56809980e7c50850ef28568738"`);
        await queryRunner.query(`DROP TABLE "price_point_transactions_transaction"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25cccfb871f03453784eebfbf5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0179d47991124bd4b8fac23f30"`);
        await queryRunner.query(`DROP TABLE "product_transactions_transaction"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b1b31069b04f28a3026e6db725"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_291b42c8bea202db2a92e258a6"`);
        await queryRunner.query(`DROP TABLE "transaction_price_points_price_point"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cbcd32c22772881f4bc084aabd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d56cf0ee79b6fb78c7ab8db379"`);
        await queryRunner.query(`DROP TABLE "transaction_product_product"`);
        await queryRunner.query(`DROP TABLE "transformation"`);
        await queryRunner.query(`DROP TABLE "price_point"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "seller"`);
    }

}
