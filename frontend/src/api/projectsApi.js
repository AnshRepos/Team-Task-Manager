import { httpClient } from './httpClient.js';

export const projectsApi = Object.freeze({
  async list() {
    const { data } = await httpClient.get('/projects');
    return data.data;
  },
  async get(projectId) {
    const { data } = await httpClient.get(`/projects/${projectId}`);
    return data.data;
  },
  async create(payload) {
    const { data } = await httpClient.post('/projects', payload);
    return data.data;
  },
  async update(projectId, payload) {
    const { data } = await httpClient.patch(`/projects/${projectId}`, payload);
    return data.data;
  },
  async remove(projectId) {
    const { data } = await httpClient.delete(`/projects/${projectId}`);
    return data.data;
  },
  async addMember(projectId, userId) {
    const { data } = await httpClient.post(`/projects/${projectId}/members`, { userId });
    return data.data;
  },
  async removeMember(projectId, userId) {
    const { data } = await httpClient.delete(`/projects/${projectId}/members/${userId}`);
    return data.data;
  },
});
