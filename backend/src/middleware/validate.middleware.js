import { ApiError } from '../utils/api-error.js';

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    next(new ApiError(400, 'Validation failed', details));
    return;
  }

  req.validated = result.data;
  next();
};
