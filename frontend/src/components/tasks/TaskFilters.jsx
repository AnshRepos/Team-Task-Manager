import { taskStatuses } from '../../constants/taskOptions.js';
import { Input } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';
import { Toolbar } from '../ui/Toolbar.jsx';

export const TaskFilters = ({ filters, onChange }) => (
  <Toolbar>
    <div className="grid flex-1 gap-3 sm:grid-cols-3">
      <Input
        id="task-search"
        label="Search"
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        placeholder="Search tasks"
      />
      <Select
        id="task-status-filter"
        label="Status"
        value={filters.status}
        onChange={(event) => onChange({ ...filters, status: event.target.value })}
      >
        <option value="">All statuses</option>
        {taskStatuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </Select>
      <Select
        id="task-overdue-filter"
        label="Overdue"
        value={filters.overdue}
        onChange={(event) => onChange({ ...filters, overdue: event.target.value })}
      >
        <option value="">All tasks</option>
        <option value="true">Overdue only</option>
        <option value="false">Not overdue</option>
      </Select>
    </div>
  </Toolbar>
);
