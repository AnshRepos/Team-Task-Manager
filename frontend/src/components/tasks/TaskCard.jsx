import { Link } from 'react-router';

import { formatDate } from '../../utils/formatters.js';
import { Badge } from '../ui/Badge.jsx';
import { Card, CardBody } from '../ui/Card.jsx';
import { TaskStatusBadge } from './TaskStatusBadge.jsx';

export const TaskCard = ({ task }) => (
  <Card>
    <CardBody>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link className="font-semibold text-slate-950 hover:text-brand-700" to={`/tasks/${task.id}`}>
            {task.title}
          </Link>
          <p className="mt-1 text-sm text-slate-500">{task.projectId?.name || task.project?.name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TaskStatusBadge label={task.statusLabel} status={task.status} />
          {task.isOverdue ? <Badge variant="danger">Overdue</Badge> : null}
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{task.description || 'No description'}</p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        <span>Due {formatDate(task.dueDate)}</span>
        <span>Assigned to {task.assigneeId?.name || 'Unassigned'}</span>
      </div>
    </CardBody>
  </Card>
);
