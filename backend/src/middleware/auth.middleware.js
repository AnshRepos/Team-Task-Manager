import { User } from '../models/user.model.js';
import { ApiError } from '../utils/api-error.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { requireRole } from './authorization.middleware.js';

const getBearerToken = (authorizationHeader) => {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authorizationHeader.slice(7).trim();
};

export const authenticate = async (req, _res, next) => {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      throw new ApiError(401, 'Authentication token is required');
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw new ApiError(401, 'Invalid authentication token');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    next(new ApiError(401, 'Invalid or expired authentication token'));
  }
};

export const authorize =
  (...allowedRoles) =>
  requireRole(...allowedRoles);
