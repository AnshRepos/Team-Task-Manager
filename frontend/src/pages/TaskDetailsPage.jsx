import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { tasksApi } from '../api/tasksApi.js';
import { TaskAssignmentPanel } from '../components/tasks/TaskAssignmentPanel.jsx';
import { TaskForm } from '../components/tasks/TaskForm.jsx';
import { TaskStatusBadge } from '../components/tasks/TaskStatusBadge.jsx';
import { TaskStatusControl } from '../components/tasks/TaskStatusControl.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { useAsyncAction } from '../hooks/useAsyncAction.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { useAuth } from '../hooks/useAuth.js';
import { formatDate } from '../utils/formatters.js';

export const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = user?.role === 'admin';
  const [isEditing, setIsEditing] = useState(false);
  const loadTask = useCallback(() => tasksApi.get(taskId), [taskId]);
  const { data, error, isLoading, refetch } = useAsyncData(loadTask);
  const action = useAsyncAction();
  const task = data?.task;

  const handleUpdate = (payload) =>
    action.run(async () => {
      await tasksApi.update(taskId, payload);
      setIsEditing(false);
      await refetch();
    });

  const handleDelete = () =>
    action.run(async () => {
      await tasksApi.remove(taskId);
      navigate('/tasks', { replace: true });
    });

  const handleAssign = (assigneeId) =>
    action.run(async () => {
      await tasksApi.assign(taskId, assigneeId);
      await refetch();
    });

  const handleStatusUpdate = (status) =>
    action.run(async () => {
      await tasksApi.updateStatus(taskId, status);
      await refetch();
    });

  if (isLoading) {
    return <EmptyState title="Loading task" description="Fetching task details." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <>
      <SectionHeader
        eyebrow="Task"
        title={task?.title || 'Task details'}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
            {canManage ? (
              <>
                <Button variant="secondary" onClick={() => setIsEditing((current) => !current)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </>
            ) : null}
          </div>
        }
      />

      {action.error ? (
        <div className="mb-5">
          <ErrorState message={action.error} />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-950">Task details</h2>
              <div className="flex flex-wrap gap-2">
                <TaskStatusBadge label={task?.statusLabel} status={task?.status} />
                {task?.isOverdue ? <Badge variant="danger">Overdue</Badge> : null}
              </div>
            </div>
          </CardHeader>
          <CardBody>
            {isEditing ? (
              <TaskForm
                isLoading={action.isLoading}
                task={task}
                onCancel={() => setIsEditing(false)}
                onSubmit={handleUpdate}
              />
            ) : (
              <div className="space-y-4 text-sm text-slate-600">
                <p>{task?.description || 'No description'}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <p>Due: {formatDate(task?.dueDate)}</p>
                  <p>Assignee: {task?.assigneeId?.name || 'Unassigned'}</p>
                  <p>Project: {task?.projectId?.name || 'Unknown project'}</p>
                  <p>Status updates: {task?.statusUpdateLocked ? 'Locked' : 'Allowed'}</p>
                </div>
                {task?.projectId?.id ? (
                  <Link className="inline-flex text-sm font-medium text-brand-700" to={`/projects/${task.projectId.id}`}>
                    Open project
                  </Link>
                ) : null}
              </div>
            )}
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-slate-950">Status</h2>
            </CardHeader>
            <CardBody>
              <TaskStatusControl task={task} onUpdate={handleStatusUpdate} />
            </CardBody>
          </Card>

          {canManage ? (
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-slate-950">Assignment</h2>
              </CardHeader>
              <CardBody>
                <TaskAssignmentPanel task={task} onAssign={handleAssign} />
              </CardBody>
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
};
