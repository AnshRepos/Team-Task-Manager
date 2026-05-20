import { taskStatuses } from '../constants/task-statuses.js';
import { Project } from '../models/project.model.js';
import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/api-error.js';
import { sendSuccess } from '../utils/api-response.js';
import { httpStatus } from '../utils/http-status.js';
import { canUpdateTaskStatus, canViewProject, canViewTask, isAdmin, isSameUser } from '../utils/rbac.js';

const userSelect = 'name email role';
const projectSelect = 'name description status memberIds';

const toId = (value) => value?._id?.toString?.() || value?.id?.toString?.() || value?.toString?.();

const normalizeDate = (value) => (value ? new Date(value) : null);

const isProjectMemberId = (project, userId) =>
  project.memberIds.some((memberId) => toId(memberId) === toId(userId));

const loadProject = async (projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  return project;
};

const loadTask = async (taskId) => {
  const task = await Task.findById(taskId)
    .populate('projectId', projectSelect)
    .populate('assigneeId', userSelect)
    .populate('createdBy', userSelect);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  return task;
};

const populateTask = (query) =>
  query.populate('projectId', projectSelect).populate('assigneeId', userSelect).populate('createdBy', userSelect);

const assertAssigneeCanReceiveTask = async (project, assigneeId) => {
  if (!assigneeId) {
    return null;
  }

  const assignee = await User.findById(assigneeId);

  if (!assignee) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignee not found');
  }

  if (!isProjectMemberId(project, assigneeId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Assignee must be a member of the project');
  }

  return assignee;
};

const buildTaskFilter = ({ status, overdue } = {}) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (overdue === true) {
    filter.dueDate = { $lt: new Date() };
    filter.status = status || { $ne: taskStatuses.DONE };
  }

  if (overdue === false) {
    filter.$or = [{ dueDate: null }, { dueDate: { $gte: new Date() } }, { status: taskStatuses.DONE }];
  }

  return filter;
};

export const createTask = async (req, res) => {
  const { projectId } = req.validated.params;
  const { title, description, status, dueDate, assigneeId, statusUpdateLocked } = req.validated.body;
  const project = await loadProject(projectId);

  await assertAssigneeCanReceiveTask(project, assigneeId);

  const task = await Task.create({
    projectId,
    title,
    description,
    status,
    dueDate: normalizeDate(dueDate),
    assigneeId: assigneeId || null,
    createdBy: req.user.id,
    statusUpdateLocked,
  });

  const populatedTask = await loadTask(task.id);

  return sendSuccess(res, {
    statusCode: httpStatus.CREATED,
    message: 'Task created successfully',
    data: {
      task: populatedTask.toJSON(),
    },
  });
};

export const getTasksByProject = async (req, res) => {
  const { projectId } = req.validated.params;
  const project = await loadProject(projectId);

  if (!canViewProject(req.user, project)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access this project');
  }

  const filter = {
    projectId,
    ...buildTaskFilter(req.validated.query),
  };

  if (!isAdmin(req.user)) {
    filter.assigneeId = req.user.id;
  }

  const tasks = await populateTask(Task.find(filter)).sort({ dueDate: 1, updatedAt: -1 });

  return sendSuccess(res, {
    message: 'Project tasks fetched successfully',
    data: {
      tasks: tasks.map((task) => task.toJSON()),
    },
  });
};

export const getAssignedTasks = async (req, res) => {
  const targetUserId = req.validated.params.userId || req.user.id;

  if (!isAdmin(req.user) && !isSameUser(req.user.id, targetUserId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access these tasks');
  }

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const tasks = await populateTask(
    Task.find({
      assigneeId: targetUserId,
      ...buildTaskFilter(req.validated.query),
    }),
  ).sort({ dueDate: 1, updatedAt: -1 });

  return sendSuccess(res, {
    message: 'Assigned tasks fetched successfully',
    data: {
      tasks: tasks.map((task) => task.toJSON()),
    },
  });
};

export const getTask = async (req, res) => {
  const task = await loadTask(req.validated.params.taskId);

  if (!canViewTask(req.user, task)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access this task');
  }

  return sendSuccess(res, {
    message: 'Task fetched successfully',
    data: {
      task: task.toJSON(),
    },
  });
};

export const updateTask = async (req, res) => {
  const updates = { ...req.validated.body };

  if ('dueDate' in updates) {
    updates.dueDate = normalizeDate(updates.dueDate);
  }

  const task = await populateTask(
    Task.findByIdAndUpdate(req.validated.params.taskId, updates, {
      new: true,
      runValidators: true,
    }),
  );

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  return sendSuccess(res, {
    message: 'Task updated successfully',
    data: {
      task: task.toJSON(),
    },
  });
};

export const assignTask = async (req, res) => {
  const { assigneeId } = req.validated.body;
  const task = await Task.findById(req.validated.params.taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const project = await loadProject(task.projectId);
  await assertAssigneeCanReceiveTask(project, assigneeId);

  task.assigneeId = assigneeId || null;
  await task.save();

  const populatedTask = await loadTask(task.id);

  return sendSuccess(res, {
    message: assigneeId ? 'Task assigned successfully' : 'Task unassigned successfully',
    data: {
      task: populatedTask.toJSON(),
    },
  });
};

export const updateTaskStatus = async (req, res) => {
  const task = await Task.findById(req.validated.params.taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  if (!canUpdateTaskStatus(req.user, task)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update this task status');
  }

  task.status = req.validated.body.status;
  await task.save();

  const populatedTask = await loadTask(task.id);

  return sendSuccess(res, {
    message: 'Task status updated successfully',
    data: {
      task: populatedTask.toJSON(),
    },
  });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.validated.params.taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  return sendSuccess(res, {
    message: 'Task deleted successfully',
    data: {
      taskId: task.id,
    },
  });
};
