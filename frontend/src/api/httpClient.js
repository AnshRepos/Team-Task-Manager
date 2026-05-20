import axios from 'axios';

import { env } from '../config/env.js';
import { tokenStorage } from './tokenStorage.js';

export const httpClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('team-task-manager:unauthorized'));
    }

    return Promise.reject({
      status: error.response?.status,
      message,
      details: error.response?.data?.error?.details || null,
      raw: error,
    });
  },
);
