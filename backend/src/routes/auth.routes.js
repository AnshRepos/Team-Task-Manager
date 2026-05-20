import { Router } from 'express';

import { getCurrentUser, login, logout, signup } from '../controllers/auth.controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema, signupSchema } from '../validators/auth.schema.js';

export const authRoutes = Router();

authRoutes.post('/signup', validate(signupSchema), asyncHandler(signup));
authRoutes.post('/login', validate(loginSchema), asyncHandler(login));
authRoutes.get('/me', authenticate, asyncHandler(getCurrentUser));
authRoutes.post('/logout', authenticate, asyncHandler(logout));
