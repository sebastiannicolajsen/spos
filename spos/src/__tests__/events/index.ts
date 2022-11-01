import api from "../../utils/api";
import { sellers } from "../../utils/seeding/sellers/sellers";
import { subscribers } from "../../utils/seeding/subscribers/subscribers";
import functions from "../../utils/test-helpers/functions";

describe('/events', () => {
    beforeAll(async () => {
      await functions.setup([sellers, subscribers]);
    });
  
    afterAll(async () => {
      await functions.teardown();
    });
  
    it('fetches correct events', async () => {
      const result = await api.authAdmin('get', '/events', {});
      expect(result.data.events).toBeDefined();
      expect(result.data.events.includes('test.never_executed')).toBe(true);
    });
  });