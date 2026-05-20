import mongoose from 'mongoose';

import { taskStatuses, taskStatusLabels, taskStatusValues } from '../constants/task-statuses.js';

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 160,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    status: {
      type: String,
      enum: taskStatusValues,
      default: taskStatuses.TO_DO,
      required: true,
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    statusUpdateLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  },
);

taskSchema.virtual('statusLabel').get(function statusLabel() {
  return taskStatusLabels[this.status];
});

taskSchema.virtual('isOverdue').get(function isOverdue() {
  if (!this.dueDate || this.status === taskStatuses.DONE) {
    return false;
  }

  return this.dueDate.getTime() < Date.now();
});

taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assigneeId: 1, status: 1 });
taskSchema.index({ assigneeId: 1, dueDate: 1, status: 1 });
taskSchema.index({ projectId: 1, dueDate: 1 });

export const Task = mongoose.model('Task', taskSchema);
