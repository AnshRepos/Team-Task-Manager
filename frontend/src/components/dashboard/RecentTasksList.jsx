import { formatDate } from '../../utils/formatters.js';
import { Card, CardBody, CardHeader } from '../ui/Card.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';

export const RecentTasksList = ({ tasks = [] }) => (
  <Card>
    <CardHeader>
      <h2 className="text-base font-semibold text-slate-950">Recent tasks</h2>
    </CardHeader>
    <CardBody>
      {tasks.length === 0 ? (
        <EmptyState
          title="No recent task changes"
          description="Recently updated tasks will show up here."
        />
      ) : (
        <div className="divide-y divide-slate-200">
          {tasks.map((task) => (
            <article key={task.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-slate-950">{task.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{task.project?.name}</p>
                </div>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {task.statusLabel}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>Updated {formatDate(task.updatedAt)}</span>
                {task.assignee?.name ? <span>Assigned to {task.assignee.name}</span> : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </CardBody>
  </Card>
);
