import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env', debug: true });
import { AppDataSource } from './repositories/data-source';
import api from './api';
import subscribers from './subscribers';

AppDataSource.initialize()
  .then(async () => {
    await subscribers();
    await api(); 
  })
  .catch((error) => {
    console.log(error);
    // todo: properly close open connections.
  });
