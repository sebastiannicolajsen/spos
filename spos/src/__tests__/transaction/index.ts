import { sellers } from '../../utils/seeding/sellers/sellers';
import api from '../../utils/api';
import functions from '../../utils/test-helpers/functions';
import { products } from '../../utils/seeding/products/products';
import { transactions } from '../../utils/seeding/transactions/transactions';

describe('/transaction', () => {
  beforeAll(async () => {
    await functions.setup([sellers, products, transactions]);
  });

  afterAll(async () => {
    await functions.teardown();
  });

  it('lists all transactions for authorised user', async () => {
    const result = await api.authDefault('get', '/transaction', {});

    expect(result.data.transactions.length).toBe(1);
  });

  it('fetches a particular transaction for authorised user', async () => {
    const result = await api.authDefault('get', '/transaction/1', {});

    expect(result.data.transaction.id).toBe(1);
  });

  it('deletes a particular transaction for authorised user', async () => {
    const result = await api.authDefault('delete', '/transaction/1', {});

    expect(result.status).toBe(200);
  });

  it('creates transaction for authorised user', async () => {
    const result = await api.authDefault('post', '/transaction', {
      seller: 1,
      items: [{ product_id: 1, quantity: 1, price_point_id: 1 }],
    });

    expect(result.status).toBe(200);
    expect(result.data.transaction.id).toBe(2);
  });

  it('fails to create transaction when product does not exist', async () => {
    api.expectError(async () =>
      api.authDefault('post', '/transaction', {
        seller: 1,
        items: [{ product_id: 2, quantity: 1, price_point_id: 1 }],
      })
    );
  });

  it('fails to create product when not correct price point', async () => {
    api.expectError(async () =>
      api.authDefault('post', '/transaction', {
        seller: 1,
        items: [{ product_id: 1, quantity: 1, price_point_id: 2 }],
      })
    );
  });

  it('fails all calls for unauthorised user', async () => {
    api.expectError(async () => api.noAuth('get', '/transaction', {}));
    api.expectError(async () => api.noAuth('get', '/transaction/1', {}));
    api.expectError(async () => api.noAuth('delete', '/transaction/1', {}));
    api.expectError(async () => api.noAuth('post', '/transaction', {}));
  });
});
