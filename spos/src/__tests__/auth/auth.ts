import { sellers } from '../../utils/seeding/sellers/sellers';
import api from '../../utils/api';
import functions from '../../utils/test-helpers/functions';

describe('/auth/login', () => {
  beforeAll(async () => {
    await functions.setup([sellers]);
  });

  afterAll(async () => {
    await functions.teardown();
  });

  it('Log in to correct user', async () => {
    const result = await api.authAdmin('get', '/whoami');

    expect(result.data.user.username).toBe('admin');
  });

  it('Fails to execute admin priviliged call', async () => {
    api.expectError(async () => api.authDefault('get', '/subscriber'));
  });
});
