import { sendSuccess } from '../utils/api-response.js';

export const createProjectExample = (_req, res) =>
  sendSuccess(res, {
    message: 'Admin is allowed to create projects',
  });

export const updateProjectExample = (_req, res) =>
  sendSuccess(res, {
    message: 'Admin is allowed to update projects',
  });

export const deleteProjectExample = (_req, res) =>
  sendSuccess(res, {
    message: 'Admin is allowed to delete projects',
  });

export const manageMembersExample = (_req, res) =>
  sendSuccess(res, {
    message: 'Admin is allowed to manage members',
  });

export const createTaskExample = (_req, res) =>
  sendSuccess(res, {
    message: 'Admin is allowed to create and assign tasks',
  });

export const viewAssignedTaskExample = (req, res) =>
  sendSuccess(res, {
    message: 'User is allowed to view this assigned task',
    data: {
      task: req.task,
    },
  });

export const updateTaskStatusExample = (req, res) =>
  sendSuccess(res, {
    message: 'User is allowed to update this task status',
    data: {
      taskId: req.task.id,
    },
  });
