import { httpClient } from './httpClient.js';

export const tasksApi = Object.freeze({
  async assignedToMe(params = {}) {
    const { data } = await httpClient.get('/tasks/assigned/me', { params });
    return data.data;
  },
  async byProject(projectId, params = {}) {
    const { data } = await httpClient.get(`/tasks/project/${projectId}`, { params });
    return data.data;
  },
  async get(taskId) {
    const { data } = await httpClient.get(`/tasks/${taskId}`);
    return data.data;
  },
  async create(projectId, payload) {
    const { data } = await httpClient.post(`/tasks/project/${projectId}`, payload);
    return data.data;
  },
  async update(taskId, payload) {
    const { data } = await httpClient.patch(`/tasks/${taskId}`, payload);
    return data.data;
  },
  async remove(taskId) {
    const { data } = await httpClient.delete(`/tasks/${taskId}`);
    return data.data;
  },
  async assign(taskId, assigneeId) {
    const { data } = await httpClient.patch(`/tasks/${taskId}/assign`, { assigneeId });
    return data.data;
  },
  async updateStatus(taskId, status) {
    const { data } = await httpClient.patch(`/tasks/${taskId}/status`, { status });
    return data.data;
  },
});
