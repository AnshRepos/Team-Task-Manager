import { Card, CardBody, CardHeader } from '../ui/Card.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';

export const ProjectSummaryList = ({ projects = [] }) => (
  <Card>
    <CardHeader>
      <h2 className="text-base font-semibold text-slate-950">Project summary</h2>
    </CardHeader>
    <CardBody>
      {projects.length === 0 ? (
        <EmptyState
          title="No project activity yet"
          description="Project task summaries will appear here once work is created."
        />
      ) : (
        <div className="divide-y divide-slate-200">
          {projects.map((project) => (
            <article key={project.project.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-slate-950">{project.project.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {project.completedTasks} completed · {project.pendingTasks} pending
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-950">{project.totalTasks}</p>
                  <p className="text-xs text-slate-500">tasks</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {project.tasksByStatus.map((item) => (
                  <span
                    key={item.status}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    {item.label}: {item.count}
                  </span>
                ))}
                {project.overdueTasks > 0 ? (
                  <span className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                    {project.overdueTasks} overdue
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </CardBody>
  </Card>
);
