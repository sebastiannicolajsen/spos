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
    const login = await api.client.post('/auth/login', {
        username: 'admin',
        password: 'supersecret',
    });

    const result = await api.client.get('/whoami', {
      headers: {
        Authorization: `Bearer ${login.data.token}`,
      },
    });

    expect(result.data.user.username).toBe('admin');
  });
});
