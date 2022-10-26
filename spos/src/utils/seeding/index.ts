import { AppDataSource } from '../../repositories/data-source';
import { products } from './products/products';
import { sellers } from './sellers/sellers';
import { transactions } from './transactions/transactions';

// import all seedings
const seedings = [sellers, products, transactions];

console.log('Connecting to db ...');
AppDataSource.initialize()
  .then(async () => {
    console.log('Seeding database ...');
    for (const seeding of seedings) {
      await seeding();
    }
    console.log('Seeding done.');
  })
  .catch((error) => console.log(error));
