import api from '../../api';
import axios, { AxiosInstance, AxiosResponse, Method } from 'axios';
import { Server } from 'http';

class Api {
  client: AxiosInstance;
  api: Server;

  userType: string;
  token: string;

  constructor() {}

  async setupApi(): Promise<void> {
    this.api = await api();
    this.client = axios.create({ baseURL: 'http://localhost:3000/api' });
  }

  async teardownApi(): Promise<void> {
    await this.api.close();
  }

  async expectError(fun: () => Promise<AxiosResponse<any, any>>) {
    try {
      await fun();
      throw new Error('Expected error');
    } catch (e) {
      expect(e);
    }
  }

  async authDefault(
    method: Method,
    path: string,
    data = {}
  ): Promise<AxiosResponse<any, any>> {
    return await this.auth('default', method, path, data);
  }

  async authAdmin(
    method: Method,
    path: string,
    data = {}
  ): Promise<AxiosResponse<any, any>> {
    return await this.auth('admin', method, path, data);
  }

  private async auth(
    username: string,
    method: Method,
    url: string,
    data: any
  ): Promise<AxiosResponse<any, any>> {
    let token: string;
    if (this.userType === username) {
      token = this.token;
    } else {
      token = (
        await this.client.post('/auth/login', {
          username,
          password: 'supersecret',
        })
      ).data.token;
      this.token = token;
      this.userType = username;
    }

    return this.client.request({
      method,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
  }
}
export default new Api();
