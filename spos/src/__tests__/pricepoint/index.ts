import { sellers } from '../../utils/seeding/sellers/sellers';
import api from '../../utils/api';
import functions from '../../utils/test-helpers/functions';
import { products } from '../../utils/seeding/products/products';

describe('/price_point', () => {
  beforeAll(async () => {
    await functions.setup([sellers, products]);
  });

  afterAll(async () => {
    await functions.teardown();
  });

  it('creates price_point for admin user', async () => {});

  it('resets price_points for admin user', async () => {});

  it('fails all calls for unauthorised an default user', async () => {});
});
