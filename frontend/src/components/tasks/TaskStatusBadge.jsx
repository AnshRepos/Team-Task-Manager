import { Badge } from '../ui/Badge.jsx';

const variants = {
  to_do: 'default',
  in_progress: 'info',
  done: 'success',
};

export const TaskStatusBadge = ({ label, status }) => (
  <Badge variant={variants[status] || 'default'}>{label || status}</Badge>
);
