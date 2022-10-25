import { sellers } from '../../utils/seeding/sellers/sellers';
import api from '../../utils/api';
import functions from '../../utils/test-helpers/functions';
import { products } from '../../utils/seeding/products/products';

describe('/cron', () => {
  beforeAll(async () => {
    await functions.setup([sellers, products]);
  });

  afterAll(async () => {
    await functions.teardown();
  });

  it('lists all cron jobs for admin', async () => {
    const result = await api.authAdmin('get', '/whoami');

    expect(result.data.user.username).toBe('admin');
  });

  it('creates cron job for admin', async () => {});

  it('fails to create cron job when name exists', async () => {});

  it('pauses cron job for admin', async () => {});

  it('fails to pause non existing cron job for admin', async () => {});

  it('fails to pause cron job not running for admin', async () => {});

  it('restarts cron job for admin', async () => {});

  it('fails to restart non existing cron job for admin', async () => {});

  it('fails to restart cron job not running for admin', async () => {});

  it('deletes cron job for admin', async () => {});

  it('fails all calls for unauthorised an default user', async () => {});
});
