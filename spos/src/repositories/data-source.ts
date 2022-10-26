import * as env from 'dotenv';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PricePoint } from '../models/PricePoint';
import { Product } from '../models/Product';
import { Transaction } from '../models/Transaction';
import { CronJob } from '../models/CronJob';
import { Subscriber } from '../models/Subscriber';
import { Seller } from '../models/Seller';

type DbConfig = {
  type: 'postgres' | 'sqlite';
} & any;

let config: DbConfig;

if (process.env.NODE_ENV === 'test') {
  config = {
    type: 'sqlite',
    database: ':memory:',
    migrationsRun: true,
  };
} else {
  // for migrations:
  if (!process.env.DATABASE_HOST) {
    dotenv.config();
  }
  config = {
    type: process.env.DATABASE_TYPE,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };
}

export const AppDataSource = new DataSource({
  ...config,
  synchronize: true,
  logging: false,
  entities: [Seller, Product, PricePoint, Transaction, CronJob, Subscriber],
  migrations: ['/../migration/*.ts'],
  subscribers: [],
});
