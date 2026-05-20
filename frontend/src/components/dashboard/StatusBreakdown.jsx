import { Card, CardBody, CardHeader } from '../ui/Card.jsx';

const statusStyles = {
  to_do: 'bg-slate-500',
  in_progress: 'bg-blue-600',
  done: 'bg-emerald-600',
};

export const StatusBreakdown = ({ statuses = [], totalTasks = 0 }) => (
  <Card>
    <CardHeader>
      <h2 className="text-base font-semibold text-slate-950">Status breakdown</h2>
    </CardHeader>
    <CardBody className="space-y-4">
      {statuses.map((item) => {
        const percentage = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;

        return (
          <div key={item.status}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-700">{item.label}</span>
              <span className="text-slate-500">
                {item.count} · {percentage}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={['h-full rounded-full', statusStyles[item.status] || 'bg-slate-500'].join(
                  ' ',
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </CardBody>
  </Card>
);
