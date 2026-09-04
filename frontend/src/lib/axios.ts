import axios from 'axios';
import { readStoredToken } from './storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  headers: { Accept: 'application/json' },
});

/*
 * The token is read from storage rather than from the store so this module
 * stays free of an import cycle with the auth slice.
 */
api.interceptors.request.use((config) => {
  const token = readStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let onUnauthorized: (() => void) | null = null;

/**
 * Registered by the store so a token revoked elsewhere ends the local session
 * instead of leaving the user on a dashboard that can no longer load data.
 */
export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isSignInAttempt = error.config?.url === '/api/login';

    if (error.response?.status === 401 && !isSignInAttempt) {
      onUnauthorized?.();
    }

    return Promise.reject(error);
  },
);

export default api;
