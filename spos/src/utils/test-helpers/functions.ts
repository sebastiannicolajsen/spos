import api from '../api';
import setupdb from '../db';

let dbConnection = null;

export default {
  setup: async (funcs) => {
    dbConnection = await setupdb();
    for (const fun of funcs) await fun();
    await api.setupApi();
  },

  teardown: async () => {
    await api.teardownApi();
    await dbConnection.close();
  },
};
