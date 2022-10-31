import { sellers } from '../../utils/seeding/sellers/sellers';
import api from '../../utils/api';
import functions from '../../utils/test-helpers/functions';
import { products } from '../../utils/seeding/products/products';
import { subscribers } from '../../utils/seeding/subscribers/subscribers';

describe('/cron', () => {
  beforeAll(async () => {
    await functions.setup([sellers, products, subscribers]);
  });

  afterAll(async () => {
    await functions.teardown();
  });

  it('lists all subscribers for admin', async () => {
    const result = await api.authAdmin('get', '/subscriber');
    expect(result.data.subscribers).toHaveLength(1);
  });

  it('fetches correct subscriber', async () => {
    const result = await api.authAdmin('get', '/subscriber/test');
    expect(result.data.subscriber.id).toBe('test');
  });

  it('fails on validation of empty code', async () => {
    const res = await api.authAdmin('post', '/subscriber/test/validate', {
      id: 'unique-id',
      products: ['*'],
      events: ['some-event'],
      code: '',
    });

    expect(res.data.validation.success).toBe(false);
  });

  it('fails on validation if id exists', async () => {
    const res = await api.authAdmin('post', '/subscriber/test/validate', {
      id: 'unique-id',
      products: ['*'],
      events: ['some-event'],
      code: '1234',
    });

    expect(res.data.validation.success).toBe(false);
  });

  it('fails on validation of code when product not existing', async () => {
    const res = await api.authAdmin('post', '/subscriber/test/validate', {
      id: 'unique-id',
      products: ['10'],
      events: ['some-event'],
      code: '(products) => products',
    });

    expect(res.data.validation.success).toBe(false);
  });

  it('fails on validation of code not returning proper object', async () => {
    const res = await api.authAdmin('post', '/subscriber/test/validate', {
      id: 'unique-id',
      products: ['*'],
      events: ['some-event'],
      code: '(products) => products',
    });

    expect(res.data.validation.success).toBe(false);
  });

  it('succeeds on validation of correct code on all objects', async () => {
    const res = await api.authAdmin('post', '/subscriber/test/validate', {
      id: 'unique-id-1',
      products: ['*'],
      events: ['some-event'],
      code: '(products) => ({1: products[0].price_points[0]})',
    });

    expect(res.data.validation.success).toBe(true);
  });

  it('succeeds on validation of correct code on particular object', async () => {
    const res = await api.authAdmin('post', '/subscriber/test/validate', {
      id: 'unique-id-2',
      products: ['1'],
      events: ['some-event'],
      code: '(products) => ({1: products[0].price_points[0]})',
    });

    expect(res.data.validation.success).toBe(true);
  });

  it('properly triggers subscriber existing for admin', async () => {
    const res = await api.authAdmin('post', '/subscriber/test/trigger', {});

    expect(res.data.success).toBe(true);
  });

  it('fails to trigger non existing subscriber', async () => {
    api.expectError(
      async () => await api.authAdmin('post', '/subscriber/test5/trigger', {})
    );
  });

  it('successfully creates subscriber for admin', async () => {
    const res = await api.authAdmin('post', '/subscriber/test/validate', {
      id: 'unique-id-3',
      products: ['*'],
      events: ['some-event'],
      code: '(products) => ({1: products[0].price_points[0]})',
    });

    expect(res.data.success).toBe(true);
  });

  it('successfully deletes subscriber for admin', async () => {
    const res = await api.authAdmin('delete', '/subscriber/unique-id-3');

    expect(res.data.success).toBe(true);
  });

  it('successfully updates subscriber for admin', async () => {
    const res = await api.authAdmin('post', '/subscriber/unique-id-2', {
      code: '(products) => ({1: products[0].price_points[0]})',
    });

    expect(res.data.success).toBe(true);
  });


  it('fails all calls for unauthorised an default user', async () => {
    api.expectError(async () => await api.authDefault('get', '/subscriber'));
    api.expectError(async () => await api.authDefault('get', '/subscriber/test'));
    api.expectError(async () => await api.authDefault('post', '/subscriber/test/validate', {}));
    api.expectError(async () => await api.authDefault('post', '/subscriber/test/trigger', {}));
    api.expectError(async () => await api.authDefault('post', '/subscriber/test/validate', {}));
    api.expectError(async () => await api.authDefault('delete', '/subscriber/test'));
    api.expectError(async () => await api.authDefault('post', '/subscriber/test', {}));
  });
});
