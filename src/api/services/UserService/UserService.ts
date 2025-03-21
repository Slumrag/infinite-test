import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiUser } from '@api/types';

class UserService {
  axios: AxiosInstance;
  constructor() {
    this.axios = axios.create({
      baseURL: 'http://localhost:3000/users',
    });
  }
  async get(): Promise<AxiosResponse<ApiUser[]>> {
    return this.axios.request({ method: 'get' });
  }
  async getById(id: number): Promise<AxiosResponse<ApiUser>> {
    return this.axios.request({ method: 'get', url: id.toString() });
  }
  async delete(id: number) {
    return this.axios.request({ method: 'delete', url: id.toString() });
  }
  async patch(id: number, item: Omit<Partial<ApiUser>, 'id'>) {
    return this.axios.request({ method: 'patch', url: id.toString(), data: item });
  }
}

export const userService = new UserService();
