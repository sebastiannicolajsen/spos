import { Database } from 'sqlite3';
import { AppDataSource } from '../../repositories/data-source';
import { ProductRepository } from '../../repositories/ProductRepository';
import { products } from '../seeding/products/products';
import { sellers } from '../seeding/sellers/sellers';

const setupdb: () => Promise<Database> = async () => {
  const db = await new Database('db.sqlite');
  await AppDataSource.initialize();

  return db;
};

export default setupdb;
