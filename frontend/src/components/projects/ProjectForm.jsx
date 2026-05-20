import { useState } from 'react';

import { projectStatuses } from '../../constants/projectOptions.js';
import { fromDatetimeLocalValue, toDatetimeLocalValue } from '../../utils/dateInputs.js';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';
import { Textarea } from '../ui/Textarea.jsx';

const initialValues = {
  name: '',
  description: '',
  status: 'active',
  startDate: '',
  dueDate: '',
};

const buildInitialValues = (project) =>
  project
    ? {
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'active',
        startDate: toDatetimeLocalValue(project.startDate),
        dueDate: toDatetimeLocalValue(project.dueDate),
      }
    : initialValues;

export const ProjectForm = ({ isLoading = false, onCancel, onSubmit, project }) => {
  const [values, setValues] = useState(() => buildInitialValues(project));
  const [error, setError] = useState(null);

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setError(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (values.name.trim().length < 2) {
      setError('Project name must be at least 2 characters.');
      return;
    }

    onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      status: values.status,
      startDate: fromDatetimeLocalValue(values.startDate),
      dueDate: fromDatetimeLocalValue(values.dueDate),
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Input
        id="project-name"
        label="Project name"
        value={values.name}
        onChange={(event) => updateField('name', event.target.value)}
      />
      <Textarea
        id="project-description"
        label="Description"
        value={values.description}
        onChange={(event) => updateField('description', event.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          id="project-status"
          label="Status"
          value={values.status}
          onChange={(event) => updateField('status', event.target.value)}
        >
          {projectStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </Select>
        <Input
          id="project-start-date"
          label="Start date"
          type="datetime-local"
          value={values.startDate}
          onChange={(event) => updateField('startDate', event.target.value)}
        />
        <Input
          id="project-due-date"
          label="Due date"
          type="datetime-local"
          value={values.dueDate}
          onChange={(event) => updateField('dueDate', event.target.value)}
        />
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button isLoading={isLoading} loadingLabel="Saving..." type="submit">
          {project ? 'Save project' : 'Create project'}
        </Button>
      </div>
    </form>
  );
};
