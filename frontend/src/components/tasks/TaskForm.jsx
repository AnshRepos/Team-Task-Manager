import { useState } from 'react';

import { taskStatuses } from '../../constants/taskOptions.js';
import { fromDatetimeLocalValue, toDatetimeLocalValue } from '../../utils/dateInputs.js';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';
import { Textarea } from '../ui/Textarea.jsx';

const buildInitialValues = (task) => ({
  title: task?.title || '',
  description: task?.description || '',
  status: task?.status || 'to_do',
  dueDate: toDatetimeLocalValue(task?.dueDate),
  assigneeId: task?.assigneeId?.id || task?.assigneeId || '',
  statusUpdateLocked: Boolean(task?.statusUpdateLocked),
});

export const TaskForm = ({ allowAssignment = false, isLoading = false, onCancel, onSubmit, task }) => {
  const [values, setValues] = useState(() => buildInitialValues(task));
  const [error, setError] = useState(null);

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setError(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (values.title.trim().length < 2) {
      setError('Task title must be at least 2 characters.');
      return;
    }

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      dueDate: fromDatetimeLocalValue(values.dueDate),
      statusUpdateLocked: values.statusUpdateLocked,
    };

    if (allowAssignment && !task) {
      payload.assigneeId = values.assigneeId.trim() || null;
    }

    onSubmit(payload);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Input
        id="task-title"
        label="Task title"
        value={values.title}
        onChange={(event) => updateField('title', event.target.value)}
      />
      <Textarea
        id="task-description"
        label="Description"
        value={values.description}
        onChange={(event) => updateField('description', event.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          id="task-status"
          label="Status"
          value={values.status}
          onChange={(event) => updateField('status', event.target.value)}
        >
          {taskStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </Select>
        <Input
          id="task-due-date"
          label="Due date"
          type="datetime-local"
          value={values.dueDate}
          onChange={(event) => updateField('dueDate', event.target.value)}
        />
        {allowAssignment && !task ? (
          <Input
            id="task-assignee"
            label="Assignee ID"
            value={values.assigneeId}
            onChange={(event) => updateField('assigneeId', event.target.value)}
            placeholder="Project member user ID"
          />
        ) : null}
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          className="size-4 rounded border-slate-300 text-brand-600"
          type="checkbox"
          checked={values.statusUpdateLocked}
          onChange={(event) => updateField('statusUpdateLocked', event.target.checked)}
        />
        Lock member status updates
      </label>
      <div className="flex flex-wrap justify-end gap-2">
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button isLoading={isLoading} loadingLabel="Saving..." type="submit">
          {task ? 'Save task' : 'Create task'}
        </Button>
      </div>
    </form>
  );
};
