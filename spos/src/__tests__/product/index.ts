import { sellers } from '../../utils/seeding/sellers/sellers';
import api from '../../utils/api';
import functions from '../../utils/test-helpers/functions';
import { products } from '../../utils/seeding/products/products';

describe('/product', () => {
  beforeAll(async () => {
    await functions.setup([sellers, products]);
  });

  afterAll(async () => {
    await functions.teardown();
  });

  it('lists products for all', async () => {
    const result = await api.authAdmin('get', '/whoami');

    expect(result.data.user.username).toBe('admin');
  });

  it('fetches specific product for all users', async () => {})

  it('creates product for authorised admin', async () => {})

  it('updates product for authorised admin', async () => {})

  it('deletes product for authorised admin', async () => {})
  

});
