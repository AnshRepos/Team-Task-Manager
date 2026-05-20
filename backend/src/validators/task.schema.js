import mongoose from 'mongoose';
import { z } from 'zod';

import { taskStatusValues } from '../constants/task-statuses.js';

const objectIdSchema = z
  .string()
  .trim()
  .refine((value) => mongoose.isValidObjectId(value), 'Invalid MongoDB ObjectId');

const optionalDateSchema = z
  .string()
  .trim()
  .datetime({ offset: true, message: 'Date must be a valid ISO 8601 datetime' })
  .optional()
  .nullable();

const booleanQuerySchema = z
  .enum(['true', 'false'])
  .optional()
  .transform((value) => (value === undefined ? undefined : value === 'true'));

export const createTaskSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
  body: z.object({
    title: z
      .string()
      .trim()
      .min(2, 'Task title must be at least 2 characters long')
      .max(160, 'Task title must be at most 160 characters long'),
    description: z
      .string()
      .trim()
      .max(2000, 'Description must be at most 2000 characters long')
      .optional()
      .default(''),
    status: z.enum(taskStatusValues).optional(),
    dueDate: optionalDateSchema,
    assigneeId: objectIdSchema.optional().nullable(),
    statusUpdateLocked: z.boolean().optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    taskId: objectIdSchema,
  }),
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(2, 'Task title must be at least 2 characters long')
        .max(160, 'Task title must be at most 160 characters long')
        .optional(),
      description: z
        .string()
        .trim()
        .max(2000, 'Description must be at most 2000 characters long')
        .optional(),
      status: z.enum(taskStatusValues).optional(),
      dueDate: optionalDateSchema,
      statusUpdateLocked: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

export const taskParamsSchema = z.object({
  params: z.object({
    taskId: objectIdSchema,
  }),
});

export const projectTasksSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
  query: z.object({
    status: z.enum(taskStatusValues).optional(),
    overdue: booleanQuerySchema,
  }),
});

export const assignedTasksSchema = z.object({
  params: z.object({
    userId: objectIdSchema.optional(),
  }),
  query: z.object({
    status: z.enum(taskStatusValues).optional(),
    overdue: booleanQuerySchema,
  }),
});

export const assignTaskSchema = z.object({
  params: z.object({
    taskId: objectIdSchema,
  }),
  body: z.object({
    assigneeId: objectIdSchema.nullable(),
  }),
});

export const updateTaskStatusSchema = z.object({
  params: z.object({
    taskId: objectIdSchema,
  }),
  body: z.object({
    status: z.enum(taskStatusValues),
  }),
});
