import { Router } from 'express';

import { permissions } from '../constants/permissions.js';
import {
  addProjectMember,
  createProject,
  deleteProject,
  getProject,
  getProjects,
  removeProjectMember,
  updateProject,
} from '../controllers/project.controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/authorization.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  addProjectMemberSchema,
  createProjectSchema,
  projectParamsSchema,
  removeProjectMemberSchema,
  updateProjectSchema,
} from '../validators/project.schema.js';

export const projectRoutes = Router();

projectRoutes.use(authenticate);

projectRoutes
  .route('/')
  .get(asyncHandler(getProjects))
  .post(
    validate(createProjectSchema),
    requirePermission(permissions.PROJECT_CREATE),
    asyncHandler(createProject),
  );

projectRoutes
  .route('/:projectId')
  .get(validate(projectParamsSchema), asyncHandler(getProject))
  .patch(
    validate(updateProjectSchema),
    requirePermission(permissions.PROJECT_UPDATE),
    asyncHandler(updateProject),
  )
  .delete(
    validate(projectParamsSchema),
    requirePermission(permissions.PROJECT_DELETE),
    asyncHandler(deleteProject),
  );

projectRoutes.post(
  '/:projectId/members',
  validate(addProjectMemberSchema),
  requirePermission(permissions.MEMBER_MANAGE),
  asyncHandler(addProjectMember),
);

projectRoutes.delete(
  '/:projectId/members/:userId',
  validate(removeProjectMemberSchema),
  requirePermission(permissions.MEMBER_MANAGE),
  asyncHandler(removeProjectMember),
);
