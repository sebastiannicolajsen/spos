import api from '../../api';
import axios, { AxiosInstance } from 'axios';
import { Server } from 'http';

class Api {
  client: AxiosInstance
  api: Server

  constructor(){
  }

  async setupApi() : Promise<void> {
    this.api = await api();
    this.client = axios.create({ baseURL: 'http://localhost:3000/api' });
  }

  async teardownApi() : Promise<void> {
    await this.api.close();
  }

};
export default new Api();
