import { Project } from '../models/project.model.js';
import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/api-error.js';
import { sendSuccess } from '../utils/api-response.js';
import { httpStatus } from '../utils/http-status.js';
import { canViewProject, isAdmin } from '../utils/rbac.js';

const userSelect = 'name email role';

const toId = (value) => value?._id?.toString?.() || value?.id?.toString?.() || value?.toString?.();

const uniqueIds = (ids = []) => [...new Set(ids.map((id) => id.toString()))];

const normalizeDate = (value) => (value ? new Date(value) : null);

const assertUsersExist = async (userIds) => {
  const ids = uniqueIds(userIds);

  if (ids.length === 0) {
    return ids;
  }

  const count = await User.countDocuments({ _id: { $in: ids } });

  if (count !== ids.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'One or more project members do not exist');
  }

  return ids;
};

const loadProjectById = async (projectId) => {
  const project = await Project.findById(projectId)
    .populate('createdBy', userSelect)
    .populate('memberIds', userSelect);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  return project;
};

export const createProject = async (req, res) => {
  const { name, description, status, startDate, dueDate, memberIds = [] } = req.validated.body;
  const normalizedMemberIds = await assertUsersExist(memberIds);

  const project = await Project.create({
    name,
    description,
    status,
    startDate: normalizeDate(startDate),
    dueDate: normalizeDate(dueDate),
    memberIds: normalizedMemberIds,
    createdBy: req.user.id,
  });

  const populatedProject = await loadProjectById(project.id);

  return sendSuccess(res, {
    statusCode: httpStatus.CREATED,
    message: 'Project created successfully',
    data: {
      project: populatedProject.toJSON(),
    },
  });
};

export const getProjects = async (req, res) => {
  const filter = isAdmin(req.user) ? {} : { memberIds: req.user.id };
  const projects = await Project.find(filter)
    .populate('createdBy', userSelect)
    .populate('memberIds', userSelect)
    .sort({ updatedAt: -1 });

  return sendSuccess(res, {
    message: 'Projects fetched successfully',
    data: {
      projects: projects.map((project) => project.toJSON()),
    },
  });
};

export const getProject = async (req, res) => {
  const project = await loadProjectById(req.validated.params.projectId);

  if (!canViewProject(req.user, project)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access this project');
  }

  return sendSuccess(res, {
    message: 'Project fetched successfully',
    data: {
      project: project.toJSON(),
    },
  });
};

export const updateProject = async (req, res) => {
  const updates = { ...req.validated.body };
  const existingProject = await Project.findById(req.validated.params.projectId);

  if (!existingProject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  if (updates.memberIds) {
    updates.memberIds = await assertUsersExist(updates.memberIds);

    const nextMemberIds = new Set(updates.memberIds);
    const removedMemberIds = existingProject.memberIds
      .map(toId)
      .filter((memberId) => !nextMemberIds.has(memberId));

    if (removedMemberIds.length > 0) {
      await Task.updateMany(
        {
          projectId: existingProject.id,
          assigneeId: { $in: removedMemberIds },
        },
        { $set: { assigneeId: null } },
      );
    }
  }

  if ('startDate' in updates) {
    updates.startDate = normalizeDate(updates.startDate);
  }

  if ('dueDate' in updates) {
    updates.dueDate = normalizeDate(updates.dueDate);
  }

  const project = await Project.findByIdAndUpdate(existingProject.id, updates, {
    new: true,
    runValidators: true,
  })
    .populate('createdBy', userSelect)
    .populate('memberIds', userSelect);

  return sendSuccess(res, {
    message: 'Project updated successfully',
    data: {
      project: project.toJSON(),
    },
  });
};

export const deleteProject = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.validated.params.projectId);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  await Task.deleteMany({ projectId: project.id });

  return sendSuccess(res, {
    message: 'Project deleted successfully',
    data: {
      projectId: project.id,
    },
  });
};

export const addProjectMember = async (req, res) => {
  const { projectId } = req.validated.params;
  const { userId } = req.validated.body;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  const alreadyMember = project.memberIds.some((memberId) => toId(memberId) === userId);

  if (alreadyMember) {
    throw new ApiError(httpStatus.CONFLICT, 'User is already a project member');
  }

  project.memberIds.push(user._id);
  await project.save();

  const populatedProject = await loadProjectById(project.id);

  return sendSuccess(res, {
    message: 'Project member added successfully',
    data: {
      project: populatedProject.toJSON(),
    },
  });
};

export const removeProjectMember = async (req, res) => {
  const { projectId, userId } = req.validated.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  const currentMemberIds = project.memberIds.map(toId);

  if (!currentMemberIds.includes(userId)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User is not a project member');
  }

  project.memberIds = project.memberIds.filter((memberId) => toId(memberId) !== userId);
  await project.save();
  await Task.updateMany({ projectId, assigneeId: userId }, { $set: { assigneeId: null } });

  const populatedProject = await loadProjectById(project.id);

  return sendSuccess(res, {
    message: 'Project member removed successfully',
    data: {
      project: populatedProject.toJSON(),
    },
  });
};
