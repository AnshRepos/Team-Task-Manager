import { Router } from 'express';

import {
  createProjectExample,
  createTaskExample,
  deleteProjectExample,
  manageMembersExample,
  updateProjectExample,
  updateTaskStatusExample,
  viewAssignedTaskExample,
} from '../controllers/rbac-example.controller.js';
import { permissions } from '../constants/permissions.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  requirePermission,
  requireTaskAccess,
  requireTaskStatusUpdateAccess,
} from '../middleware/authorization.middleware.js';
import { asyncHandler } from '../middleware/async-handler.js';

const loadExampleAssignedTask = (req, _res, next) => {
  req.task = {
    id: req.params.taskId,
    assigneeId: req.user.id,
    statusUpdateLocked: false,
  };

  next();
};

export const rbacExampleRoutes = Router();

rbacExampleRoutes.use(authenticate);

rbacExampleRoutes.post(
  '/projects',
  requirePermission(permissions.PROJECT_CREATE),
  asyncHandler(createProjectExample),
);

rbacExampleRoutes.patch(
  '/projects/:projectId',
  requirePermission(permissions.PROJECT_UPDATE),
  asyncHandler(updateProjectExample),
);

rbacExampleRoutes.delete(
  '/projects/:projectId',
  requirePermission(permissions.PROJECT_DELETE),
  asyncHandler(deleteProjectExample),
);

rbacExampleRoutes.patch(
  '/members/:memberId',
  requirePermission(permissions.MEMBER_MANAGE),
  asyncHandler(manageMembersExample),
);

rbacExampleRoutes.post(
  '/tasks',
  requirePermission(permissions.TASK_CREATE),
  asyncHandler(createTaskExample),
);

rbacExampleRoutes.get(
  '/tasks/:taskId',
  loadExampleAssignedTask,
  requireTaskAccess(),
  asyncHandler(viewAssignedTaskExample),
);

rbacExampleRoutes.patch(
  '/tasks/:taskId/status',
  loadExampleAssignedTask,
  requireTaskStatusUpdateAccess(),
  asyncHandler(updateTaskStatusExample),
);
