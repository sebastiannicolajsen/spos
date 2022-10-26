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
    const result = await api.noAuth('get', '/product', {});

    expect(result.data.products.length).toBe(1);
  });

  it('fetches specific product for all users', async () => {
    const result = await api.noAuth('get', '/product/1', {});

    expect(result.data.product.id).toBe(1);
  });

  it('creates product for authorised admin', async () => {
    const result = await api.authAdmin('post', '/product', {
      name: 'product2',
      initial_value: 100,
      minimum_value: 10,
    });

    expect(result.status).toBe(200);
    expect(result.data.product.name).toBe('product2');
  });

  it('updates product for authorised admin', async () => {
    const result = await api.authAdmin('put', '/product/2', {
      name: 'product3',
      initial_value: 100,
      minimum_value: 10,
    });

    expect(result.status).toBe(200);
    expect(result.data.product.name).toBe('product3');
  });

  it('deletes product for authorised admin', async () => {
    const result = await api.authAdmin('delete', '/product/1', {});

    expect(result.status).toBe(200);
  });

  it('fails all calls for unauthorised an default user', async () => {
    api.expectError(async () => api.authDefault('post', '/product', {}));
    api.expectError(async () => api.authDefault('put', '/product/1', {}));
    api.expectError(async () => api.authDefault('delete', '/product/1', {}));
  });
});
