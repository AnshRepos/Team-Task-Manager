import cors from 'cors';

import { env, isProduction } from './env.js';

const allowedOrigins = new Set(env.CORS_ORIGINS);

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin && !isProduction) {
      callback(null, true);
      return;
    }

    if (origin && allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS origin is not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
