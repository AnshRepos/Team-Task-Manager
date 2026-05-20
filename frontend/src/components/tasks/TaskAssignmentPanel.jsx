import { useState } from 'react';

import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';

export const TaskAssignmentPanel = ({ onAssign, task }) => {
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId?.id || '');

  const handleSubmit = (event) => {
    event.preventDefault();
    onAssign(assigneeId.trim() || null);
  };

  return (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
      <div className="flex-1">
        <Input
          id="task-assignment"
          label="Assignee user ID"
          value={assigneeId}
          onChange={(event) => setAssigneeId(event.target.value)}
          placeholder="Project member user ID"
        />
      </div>
      <Button type="submit">Update assignee</Button>
    </form>
  );
};
