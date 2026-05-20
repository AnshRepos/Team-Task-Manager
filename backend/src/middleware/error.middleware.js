import { isProduction } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';

const isMongoDuplicateKeyError = (error) => error?.name === 'MongoServerError' && error?.code === 11000;

export const errorHandler = (error, _req, res, _next) => {
  void _next;

  const statusCode = error instanceof ApiError ? error.statusCode : isMongoDuplicateKeyError(error) ? 409 : 500;
  const message = isMongoDuplicateKeyError(error)
    ? 'A record with this value already exists'
    : statusCode === 500 && isProduction
      ? 'Internal server error'
      : error.message;

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(error instanceof ApiError && error.details ? { details: error.details } : {}),
      ...(!isProduction ? { stack: error.stack } : {}),
    },
  });
};
