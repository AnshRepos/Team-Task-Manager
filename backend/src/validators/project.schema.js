import mongoose from 'mongoose';
import { z } from 'zod';

import { projectStatusValues } from '../constants/project-statuses.js';

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

const projectBaseShape = {
  name: z
    .string()
    .trim()
    .min(2, 'Project name must be at least 2 characters long')
    .max(120, 'Project name must be at most 120 characters long'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be at most 1000 characters long')
    .optional(),
  status: z.enum(projectStatusValues).optional(),
  startDate: optionalDateSchema,
  dueDate: optionalDateSchema,
  memberIds: z.array(objectIdSchema).max(100, 'A project can include at most 100 members').optional(),
};

const validateDateOrder = (data) => {
  if (!data.startDate || !data.dueDate) {
    return true;
  }

  return new Date(data.startDate) <= new Date(data.dueDate);
};

const createProjectBodySchema = z
  .object({
    ...projectBaseShape,
    description: projectBaseShape.description.default(''),
  })
  .refine(validateDateOrder, {
    path: ['dueDate'],
    message: 'Due date must be after or equal to start date',
  });

const updateProjectBodySchema = z
  .object(projectBaseShape)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  })
  .refine(validateDateOrder, {
    path: ['dueDate'],
    message: 'Due date must be after or equal to start date',
  });

export const createProjectSchema = z.object({
  body: createProjectBodySchema,
});

export const updateProjectSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
  body: updateProjectBodySchema,
});

export const projectParamsSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
});

export const addProjectMemberSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
  body: z.object({
    userId: objectIdSchema,
  }),
});

export const removeProjectMemberSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
    userId: objectIdSchema,
  }),
});
