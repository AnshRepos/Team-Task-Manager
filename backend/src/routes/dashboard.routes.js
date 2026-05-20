import { Router } from 'express';

import { getDashboard } from '../controllers/dashboard.controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const dashboardRoutes = Router();

dashboardRoutes.get('/', authenticate, asyncHandler(getDashboard));
