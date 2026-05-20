import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env.js';
import { corsMiddleware } from './config/cors.js';
import { authRoutes } from './routes/auth.routes.js';
import { dashboardRoutes } from './routes/dashboard.routes.js';
import { healthRoutes } from './routes/health.routes.js';
import { projectRoutes } from './routes/project.routes.js';
import { rbacExampleRoutes } from './routes/rbac-example.routes.js';
import { taskRoutes } from './routes/task.routes.js';
import { notFoundHandler } from './middleware/not-found.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

export const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(corsMiddleware);
app.use(compression());
app.use(morgan(env.LOG_FORMAT));
app.use(express.json({ limit: env.REQUEST_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: env.REQUEST_BODY_LIMIT }));

app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/rbac-examples', rbacExampleRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
