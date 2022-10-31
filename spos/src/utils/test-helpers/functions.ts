import Container from 'typedi';
import CronService from '../../services/CronService';
import api from '../api';
import setupdb from '../db';
import subscribers from '../subscribers';

let dbConnection = null;

export default {
  setup: async (funcs) => {
    dbConnection = await setupdb();
    for (const fun of funcs) await fun();
    await subscribers()
    await api.setupApi();
    await Container.get(CronService).init();
  },

  teardown: async () => {
    await api.teardownApi();
    await dbConnection.close();
    await Container.get(CronService).shutdown();
  },
};
