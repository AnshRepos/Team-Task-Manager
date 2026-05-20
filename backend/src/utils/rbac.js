import { userRoles } from '../constants/user-roles.js';

const toId = (value) => value?._id?.toString?.() || value?.id?.toString?.() || value?.toString?.();

export const isAdmin = (user) => user?.role === userRoles.ADMIN;

export const isMember = (user) => user?.role === userRoles.MEMBER;

export const isSameUser = (userId, otherUserId) => Boolean(toId(userId) && toId(userId) === toId(otherUserId));

export const isTaskAssignee = (user, task) =>
  isSameUser(user?.id || user?._id, task?.assigneeId || task?.assignee);

export const isProjectMember = (user, project) => {
  if (isAdmin(user)) {
    return true;
  }

  const userId = toId(user?.id || user?._id);
  const memberIds = project?.memberIds || project?.members || [];

  return memberIds.some((memberId) => toId(memberId) === userId);
};

export const canCreateProject = (user) => isAdmin(user);

export const canUpdateProject = (user) => isAdmin(user);

export const canDeleteProject = (user) => isAdmin(user);

export const canManageMembers = (user) => isAdmin(user);

export const canCreateTask = (user) => isAdmin(user);

export const canAssignTask = (user) => isAdmin(user);

export const canUpdateTask = (user) => isAdmin(user);

export const canDeleteTask = (user) => isAdmin(user);

export const canViewProject = (user, project) => isAdmin(user) || isProjectMember(user, project);

export const canViewTask = (user, task) => isAdmin(user) || isTaskAssignee(user, task);

export const canUpdateTaskStatus = (user, task) => {
  if (isAdmin(user)) {
    return true;
  }

  if (!isMember(user) || !isTaskAssignee(user, task)) {
    return false;
  }

  return task?.statusUpdateLocked !== true;
};
