import { useState } from 'react';

import { taskStatuses } from '../../constants/taskOptions.js';
import { Button } from '../ui/Button.jsx';
import { Select } from '../ui/Select.jsx';

export const TaskStatusControl = ({ onUpdate, task }) => {
  const [status, setStatus] = useState(task.status);

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        onUpdate(status);
      }}
    >
      <div className="flex-1">
        <Select
          id="task-status-update"
          label="Update status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {taskStatuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit">Save status</Button>
    </form>
  );
};
