import { sellers } from '../../utils/seeding/sellers/sellers';
import api from '../../utils/api';
import functions from '../../utils/test-helpers/functions';
import { cronJobs } from '../../utils/seeding/cron/cron';



describe('/cron', () => {
  beforeAll(async () => {
    await functions.setup([sellers, cronJobs]);
  });

  afterAll(async () => {
    await functions.teardown();
  });

  it('lists all cron jobs for admin', async () => {
    const result = await api.authAdmin('get', '/cron');
    expect(result.data.jobs).toHaveLength(1);
  });

  it('creates cron job for admin', async () => {
    const result = await api.authAdmin('post', '/cron', {
      id: 'test2',
      event: 'test.no_subscriber',
      interval: '* * */1 * * *',
    });
    expect(result.data.job.id).toBe('test2');
    expect(result.data.job.interval).toBe('* * */1 * * *');
  });

  it('creates cron job with NEVER_EXECUTE interval when not given interval', async () => {
    const result = await api.authAdmin('post', '/cron', {
      id: 'test3',
      event: 'test.no_subscriber',
    });
    expect(result.data.job.id).toBe('test3');
    expect(result.data.job.interval).toBe('0 0 30 2 0 0');
  })

  it('fails to create cron job when name exists', async () => {
    api.expectError(async () => await api.authAdmin('post', '/cron', {
      id: 'test',
      event: 'test.no_subscriber',
      interval: '* * * * * *',
    }));
  });

  it('pauses cron job for admin', async () => {
    const result = await api.authAdmin('post', '/cron/test/pause');
    expect(result.data.success).toBe(true);
  });

  it('fails to pause non existing cron job for admin', async () => {
    api.expectError(async () => await api.authAdmin('post', '/cron/test4/pause'));
  });

  it('fails to pause cron job not running for admin', async () => {
    api.expectError(async () => await api.authAdmin('post', '/cron/test/pause'));
  });

  it('restarts cron job for admin', async () => {
    const result = await api.authAdmin('post', '/cron/test/restart');
    expect(result.data.success).toBe(true);
  });

  it('fails to restart non existing cron job for admin', async () => {
    api.expectError(async () => await api.authAdmin('post', '/cron/test4/restart'));
  });

  it('fails to restart cron job running for admin', async () => {
    api.expectError(async () => await api.authAdmin('post', '/cron/test/restart'));
  });

  it('deletes cron job for admin', async () => {
    const result = await api.authAdmin('delete', '/cron/test2');
    expect(result.data.success).toBe(true);
  });

  it('fails all calls for unauthorised an default user', async () => {
    api.expectError(async () => await api.authDefault('get', '/cron'));
    api.expectError(async () => await api.authDefault('post', '/cron'));
    api.expectError(async () => await api.authDefault('post', '/cron/test/pause'));
    api.expectError(async () => await api.authDefault('post', '/cron/test/restart'));
    api.expectError(async () => await api.authDefault('delete', '/cron/test'));
  });
});
