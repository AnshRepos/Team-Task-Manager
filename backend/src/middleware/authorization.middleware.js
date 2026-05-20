import { userRoles } from '../constants/user-roles.js';
import { ApiError } from '../utils/api-error.js';
import { httpStatus } from '../utils/http-status.js';
import {
  canAssignTask,
  canCreateProject,
  canCreateTask,
  canDeleteTask,
  canDeleteProject,
  canManageMembers,
  canUpdateProject,
  canUpdateTask,
  canUpdateTaskStatus,
  canViewProject,
  canViewTask,
} from '../utils/rbac.js';

const ensureAuthenticatedUser = (req) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication is required');
  }
};

const rejectForbidden = () => {
  throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action');
};

export const requireRole =
  (...allowedRoles) =>
  (req, _res, next) => {
    try {
      ensureAuthenticatedUser(req);

      if (!allowedRoles.includes(req.user.role)) {
        rejectForbidden();
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export const requireAdmin = requireRole(userRoles.ADMIN);

export const requireMemberOrAdmin = requireRole(userRoles.ADMIN, userRoles.MEMBER);

const staticPermissionChecks = Object.freeze({
  'project:create': canCreateProject,
  'project:update': canUpdateProject,
  'project:delete': canDeleteProject,
  'member:manage': canManageMembers,
  'task:create': canCreateTask,
  'task:assign': canAssignTask,
  'task:update': canUpdateTask,
  'task:delete': canDeleteTask,
});

export const requirePermission = (permission) => (req, _res, next) => {
  try {
    ensureAuthenticatedUser(req);

    const checkPermission = staticPermissionChecks[permission];

    if (!checkPermission) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Unknown permission: ${permission}`);
    }

    if (!checkPermission(req.user)) {
      rejectForbidden();
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireProjectAccess =
  (getProject = (req) => req.project) =>
  (req, _res, next) => {
    try {
      ensureAuthenticatedUser(req);

      const project = getProject(req);

      if (!project || !canViewProject(req.user, project)) {
        rejectForbidden();
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export const requireTaskAccess =
  (getTask = (req) => req.task) =>
  (req, _res, next) => {
    try {
      ensureAuthenticatedUser(req);

      const task = getTask(req);

      if (!task || !canViewTask(req.user, task)) {
        rejectForbidden();
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export const requireTaskStatusUpdateAccess =
  (getTask = (req) => req.task) =>
  (req, _res, next) => {
    try {
      ensureAuthenticatedUser(req);

      const task = getTask(req);

      if (!task || !canUpdateTaskStatus(req.user, task)) {
        rejectForbidden();
      }

      next();
    } catch (error) {
      next(error);
    }
  };
