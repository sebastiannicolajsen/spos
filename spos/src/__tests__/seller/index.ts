import { sellers } from '../../utils/seeding/sellers/sellers';
import api from '../../utils/api';
import functions from '../../utils/test-helpers/functions';
import { products } from '../../utils/seeding/products/products';

describe('/seller', () => {
  beforeAll(async () => {
    await functions.setup([sellers]);
  });

  afterAll(async () => {
    await functions.teardown();
  });

  it('fetches all sellers for admin user', async () => {
    const result = await api.authAdmin('get', '/seller', {});

    expect(result.data.sellers.length).toBe(2);
  });

  it('fetches specific seller for admin user', async () => {
    const result = await api.authAdmin('get', '/seller/1', {});

    expect(result.data.seller.id).toBe(1);
    expect(result.data.seller.password).toBeUndefined();
  });

  it('creates new seller for admin user', async () => {
    const result = await api.authAdmin('post', '/seller', {
      username: 'seller2',
      password: 'password',
      role: 'ADMIN',
    });

    expect(result.status).toBe(200);
    expect(result.data.seller.username).toBe('seller2');
    expect(result.data.seller.password).toBeUndefined();
  });

  it('deletes seller admin user', async () => {
    const result = await api.authAdmin('delete', '/seller/3', {});

    expect(result.status).toBe(200);
  });

  it('fails to create seller when name exists already', async () => {
    api.expectError(async () =>
      api.authAdmin('post', '/seller', {
        username: 'admin',
        password: 'password',
      })
    );
  });

  it('fails all calls for unauthorised an default user', async () => {
    api.expectError(async () => api.authDefault('get', '/seller', {}));
    api.expectError(async () => api.authDefault('get', '/seller/1', {}));
    api.expectError(async () => api.authDefault('delete', '/seller/1', {}));
    api.expectError(async () => api.authDefault('post', '/seller', {}));
  });
});
