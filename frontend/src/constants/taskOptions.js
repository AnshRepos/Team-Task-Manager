export const taskStatuses = [
  { value: 'to_do', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export const taskStatusLabelByValue = Object.fromEntries(
  taskStatuses.map((status) => [status.value, status.label]),
);
