import { sellers } from '../../utils/seeding/sellers/sellers';
import api from '../../utils/api';
import functions from '../../utils/test-helpers/functions';
import { products } from '../../utils/seeding/products/products';

describe('/seller', () => {
  beforeAll(async () => {
    await functions.setup([sellers, products]);
  });

  afterAll(async () => {
    await functions.teardown();
  });

  it('fetches all sellers for admin user', async () => {});

  it('fetches specific seller for admin user', async () => {});

  it('deletes seller admin user', async () => {});

  it('creates new seller for admin user', async () => {});

  it('fails to create seller when name exists already', async () => {});

  it('fails all calls for unauthorised an default user', async () => {});
});
