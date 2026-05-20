import { Router } from 'express';

import { permissions } from '../constants/permissions.js';
import {
  assignTask,
  createTask,
  deleteTask,
  getAssignedTasks,
  getTask,
  getTasksByProject,
  updateTask,
  updateTaskStatus,
} from '../controllers/task.controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/authorization.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  assignedTasksSchema,
  assignTaskSchema,
  createTaskSchema,
  projectTasksSchema,
  taskParamsSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from '../validators/task.schema.js';

export const taskRoutes = Router();

taskRoutes.use(authenticate);

taskRoutes
  .route('/project/:projectId')
  .get(validate(projectTasksSchema), asyncHandler(getTasksByProject))
  .post(
    validate(createTaskSchema),
    requirePermission(permissions.TASK_CREATE),
    asyncHandler(createTask),
  );

taskRoutes.get('/assigned/me', validate(assignedTasksSchema), asyncHandler(getAssignedTasks));
taskRoutes.get('/assigned/:userId', validate(assignedTasksSchema), asyncHandler(getAssignedTasks));

taskRoutes
  .route('/:taskId')
  .get(validate(taskParamsSchema), asyncHandler(getTask))
  .patch(
    validate(updateTaskSchema),
    requirePermission(permissions.TASK_UPDATE),
    asyncHandler(updateTask),
  )
  .delete(
    validate(taskParamsSchema),
    requirePermission(permissions.TASK_DELETE),
    asyncHandler(deleteTask),
  );

taskRoutes.patch(
  '/:taskId/assign',
  validate(assignTaskSchema),
  requirePermission(permissions.TASK_ASSIGN),
  asyncHandler(assignTask),
);

taskRoutes.patch('/:taskId/status', validate(updateTaskStatusSchema), asyncHandler(updateTaskStatus));
