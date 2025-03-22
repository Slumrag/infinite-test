import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiUser, PaginationOptions } from '@api/types';
class UserService {
  axios: AxiosInstance;
  constructor() {
    this.axios = axios.create({
      baseURL: 'http://localhost:3000/users',
    });
  }
  async get(options?: PaginationOptions): Promise<AxiosResponse<ApiUser[]>> {
    const { page, size } = { page: 1, size: 10, ...options };
    const start = Math.max(0, page - 1) * size;

    return this.axios.request({ method: 'get', params: { _start: start, _limit: size } });
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
