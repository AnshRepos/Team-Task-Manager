import { httpClient } from './httpClient.js';

export const authApi = Object.freeze({
  async signup(payload) {
    const { data } = await httpClient.post('/auth/signup', payload);
    return data.data;
  },
  async login(payload) {
    const { data } = await httpClient.post('/auth/login', payload);
    return data.data;
  },
  async me() {
    const { data } = await httpClient.get('/auth/me');
    return data.data;
  },
  async logout() {
    const { data } = await httpClient.post('/auth/logout');
    return data;
  },
});
