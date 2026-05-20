import mongoose from 'mongoose';

import { taskStatuses, taskStatusLabels, taskStatusValues } from '../constants/task-statuses.js';
import { Task } from '../models/task.model.js';
import { sendSuccess } from '../utils/api-response.js';
import { isAdmin } from '../utils/rbac.js';

const buildStatusSummary = (statusRows) => {
  const counts = Object.fromEntries(taskStatusValues.map((status) => [status, 0]));

  for (const row of statusRows) {
    counts[row._id] = row.count;
  }

  return taskStatusValues.map((status) => ({
    status,
    label: taskStatusLabels[status],
    count: counts[status],
  }));
};

const firstCount = (rows) => rows[0]?.count || 0;

const normalizeProjectSummary = (rows) =>
  rows.map((row) => {
    const statusSummary = buildStatusSummary(row.statuses || []);
    const completedTasks = statusSummary.find((item) => item.status === taskStatuses.DONE)?.count || 0;

    return {
      project: row.project,
      totalTasks: row.totalTasks,
      completedTasks,
      pendingTasks: row.totalTasks - completedTasks,
      overdueTasks: row.overdueTasks,
      tasksByStatus: statusSummary,
    };
  });

export const getDashboard = async (req, res) => {
  const now = new Date();
  const userObjectId = new mongoose.Types.ObjectId(req.user.id);
  const visibleTaskMatch = isAdmin(req.user) ? {} : { assigneeId: userObjectId };

  const [dashboard] = await Task.aggregate([
    { $match: visibleTaskMatch },
    {
      $facet: {
        totalTasks: [{ $count: 'count' }],
        tasksByStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
        completedTasks: [{ $match: { status: taskStatuses.DONE } }, { $count: 'count' }],
        overdueTasks: [
          {
            $match: {
              dueDate: { $lt: now },
              status: { $ne: taskStatuses.DONE },
            },
          },
          { $count: 'count' },
        ],
        assignedToMe: [{ $match: { assigneeId: userObjectId } }, { $count: 'count' }],
        projectSummaries: [
          {
            $lookup: {
              from: 'projects',
              localField: 'projectId',
              foreignField: '_id',
              as: 'project',
            },
          },
          { $unwind: '$project' },
          {
            $group: {
              _id: {
                projectId: '$projectId',
                status: '$status',
              },
              projectName: { $first: '$project.name' },
              count: { $sum: 1 },
              overdueCount: {
                $sum: {
                  $cond: [
                    {
                      $and: [{ $lt: ['$dueDate', now] }, { $ne: ['$status', taskStatuses.DONE] }],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
          {
            $group: {
              _id: '$_id.projectId',
              projectName: { $first: '$projectName' },
              totalTasks: { $sum: '$count' },
              overdueTasks: { $sum: '$overdueCount' },
              statuses: {
                $push: {
                  _id: '$_id.status',
                  count: '$count',
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              project: {
                id: { $toString: '$_id' },
                name: '$projectName',
              },
              totalTasks: 1,
              overdueTasks: 1,
              statuses: 1,
            },
          },
          { $sort: { overdueTasks: -1, totalTasks: -1, 'project.name': 1 } },
          { $limit: 10 },
        ],
        recentActivity: [
          {
            $lookup: {
              from: 'projects',
              localField: 'projectId',
              foreignField: '_id',
              as: 'project',
            },
          },
          { $unwind: '$project' },
          {
            $lookup: {
              from: 'users',
              localField: 'assigneeId',
              foreignField: '_id',
              as: 'assignee',
            },
          },
          {
            $unwind: {
              path: '$assignee',
              preserveNullAndEmptyArrays: true,
            },
          },
          { $sort: { updatedAt: -1 } },
          { $limit: 8 },
          {
            $project: {
              _id: 0,
              id: { $toString: '$_id' },
              title: 1,
              status: 1,
              statusLabel: {
                $switch: {
                  branches: taskStatusValues.map((status) => ({
                    case: { $eq: ['$status', status] },
                    then: taskStatusLabels[status],
                  })),
                  default: '$status',
                },
              },
              updatedAt: 1,
              project: {
                id: { $toString: '$project._id' },
                name: '$project.name',
              },
              assignee: {
                $cond: [
                  '$assignee',
                  {
                    id: { $toString: '$assignee._id' },
                    name: '$assignee.name',
                    email: '$assignee.email',
                  },
                  null,
                ],
              },
            },
          },
        ],
      },
    },
  ]);

  const totalTasks = firstCount(dashboard.totalTasks);
  const completedTasks = firstCount(dashboard.completedTasks);
  const overdueTasks = firstCount(dashboard.overdueTasks);

  return sendSuccess(res, {
    message: 'Dashboard fetched successfully',
    data: {
      scope: isAdmin(req.user) ? 'all_tasks' : 'assigned_tasks',
      generatedAt: now.toISOString(),
      summary: {
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        overdueTasks,
        assignedToMe: firstCount(dashboard.assignedToMe),
      },
      tasksByStatus: buildStatusSummary(dashboard.tasksByStatus),
      projectSummaries: normalizeProjectSummary(dashboard.projectSummaries),
      recentActivity: dashboard.recentActivity,
    },
  });
};
