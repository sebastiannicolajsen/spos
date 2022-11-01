import { sellers } from '../../utils/seeding/sellers/sellers';
import api from '../../utils/api';
import functions from '../../utils/test-helpers/functions';
import { products } from '../../utils/seeding/products/products';

describe('/last_execution', () => {
  beforeAll(async () => {
    await functions.setup([sellers, products]);
  });

  afterAll(async () => {
    await functions.teardown();
  });

  it('fetches last execution point', async () => {
    const result = await api.authAdmin('get', '/last_execution', {});
    expect(result.data.last_execution).toBeDefined();
  });
});


