import { httpClient } from './httpClient.js';

export const dashboardApi = Object.freeze({
  async getDashboard() {
    const { data } = await httpClient.get('/dashboard');
    return data.data;
  },
});
