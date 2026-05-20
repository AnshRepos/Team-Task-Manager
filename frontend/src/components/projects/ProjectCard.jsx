import { Link } from 'react-router';

import { formatDate } from '../../utils/formatters.js';
import { Badge } from '../ui/Badge.jsx';
import { Card, CardBody } from '../ui/Card.jsx';

const statusVariant = {
  planned: 'info',
  active: 'success',
  completed: 'default',
  archived: 'warning',
};

export const ProjectCard = ({ project }) => (
  <Card>
    <CardBody>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link className="text-lg font-semibold text-slate-950 hover:text-brand-700" to={`/projects/${project.id}`}>
            {project.name}
          </Link>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {project.description || 'No description'}
          </p>
        </div>
        <Badge variant={statusVariant[project.status] || 'default'}>{project.status}</Badge>
      </div>
      <div className="mt-5 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
        <span>Members: {project.memberIds?.length || 0}</span>
        <span>Due: {formatDate(project.dueDate)}</span>
      </div>
    </CardBody>
  </Card>
);
