import { sellers } from '../../utils/seeding/sellers/sellers';
import api from '../../utils/api';
import functions from '../../utils/test-helpers/functions';
import { products } from '../../utils/seeding/products/products';

describe('/transaction', () => {
  beforeAll(async () => {
    await functions.setup([sellers, products]);
  });

  afterAll(async () => {
    await functions.teardown();
  });

  it('lists all transactions for authorised user', async () => {
    const result = await api.authAdmin('get', '/whoami');

    expect(result.data.user.username).toBe('admin');
  });

  it('fetches a particular transaction for authorised user', async () => {});

  it('deletes a particular transaction for authorised user', async () => {});

  it('creates transaction for authorised user', async () => {});

  it('fails to create transaction when product does not exist', async () => {});

  it('fails all calls for unauthorised user', async () => {});
});
