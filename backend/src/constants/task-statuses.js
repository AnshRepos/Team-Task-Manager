export const taskStatuses = Object.freeze({
  TO_DO: 'to_do',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
});

export const taskStatusValues = Object.values(taskStatuses);

export const taskStatusLabels = Object.freeze({
  [taskStatuses.TO_DO]: 'To Do',
  [taskStatuses.IN_PROGRESS]: 'In Progress',
  [taskStatuses.DONE]: 'Done',
});
