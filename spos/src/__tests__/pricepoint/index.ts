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

  it('creates price_point for admin user', async () => {
    const result = await api.authAdmin('POST', '/price_point/1/', {
      value: 101,
    });
    expect(result.status).toBe(200);

    const { data } = await api.authAdmin('GET', '/product/1');
    expect(data.product.price_points.length).toBe(2);
  });

  it('creates price_point with min value when attempting to set lower', async () => {
    const result = await api.authAdmin('POST', '/price_point/1/', {
      value: 9,
    });
    expect(result.status).toBe(200);

    const { data } = await api.authAdmin('GET', '/product/1');
    expect(data.product.price_points.length).toBe(3);
    expect(data.product.price_points[2].value).toBe(10);
  });

  it('resets price_points for admin user', async () => {
    await api.authAdmin('POST', '/price_point/1/', {
      value: 20,
    });

    const result = await api.authAdmin('POST', '/price_point/1/reset');
    expect(result.status).toBe(200);

    const { data } = await api.authAdmin('GET', '/product/1');
    expect(data.product.price_points.length).toBe(1);
    expect(data.product.price_points[0].value).toBe(100);
  });

  it('fails all calls for unauthorised an default user', async () => {

    api.expectError(async () => api.authDefault('POST', '/price_point/1/', {}));
    api.expectError(async () => api.authDefault('POST', '/price_point/1/reset', {}));

  });
});
