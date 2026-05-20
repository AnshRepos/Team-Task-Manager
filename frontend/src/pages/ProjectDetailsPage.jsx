import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { projectsApi } from '../api/projectsApi.js';
import { tasksApi } from '../api/tasksApi.js';
import { ProjectForm } from '../components/projects/ProjectForm.jsx';
import { ProjectMembers } from '../components/projects/ProjectMembers.jsx';
import { TaskCard } from '../components/tasks/TaskCard.jsx';
import { TaskFilters } from '../components/tasks/TaskFilters.jsx';
import { TaskForm } from '../components/tasks/TaskForm.jsx';
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

export const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = user?.role === 'admin';
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', overdue: '' });

  const loadProject = useCallback(() => projectsApi.get(projectId), [projectId]);
  const loadTasks = useCallback(
    () =>
      tasksApi.byProject(projectId, {
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.overdue ? { overdue: filters.overdue } : {}),
      }),
    [filters.overdue, filters.status, projectId],
  );

  const projectQuery = useAsyncData(loadProject);
  const tasksQuery = useAsyncData(loadTasks);
  const action = useAsyncAction();

  const project = projectQuery.data?.project;
  const visibleTasks = useMemo(
    () => {
      const tasks = tasksQuery.data?.tasks || [];
      return tasks.filter((task) =>
        `${task.title} ${task.description}`.toLowerCase().includes(filters.search.toLowerCase()),
      );
    },
    [filters.search, tasksQuery.data?.tasks],
  );

  const refreshAll = async () => {
    await Promise.all([projectQuery.refetch(), tasksQuery.refetch()]);
  };

  const handleProjectUpdate = (payload) =>
    action.run(async () => {
      await projectsApi.update(projectId, payload);
      setIsEditingProject(false);
      await projectQuery.refetch();
    });

  const handleDeleteProject = () =>
    action.run(async () => {
      await projectsApi.remove(projectId);
      navigate('/projects', { replace: true });
    });

  const handleAddMember = (userId) =>
    action.run(async () => {
      await projectsApi.addMember(projectId, userId);
      await projectQuery.refetch();
    });

  const handleRemoveMember = (userId) =>
    action.run(async () => {
      await projectsApi.removeMember(projectId, userId);
      await projectQuery.refetch();
    });

  const handleCreateTask = (payload) =>
    action.run(async () => {
      await tasksApi.create(projectId, payload);
      setIsCreatingTask(false);
      await tasksQuery.refetch();
    });

  if (projectQuery.isLoading) {
    return <EmptyState title="Loading project" description="Fetching project details." />;
  }

  if (projectQuery.error) {
    return <ErrorState message={projectQuery.error} />;
  }

  return (
    <>
      <SectionHeader
        eyebrow="Project"
        title={project?.name || 'Project details'}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate('/projects')}>
              Back
            </Button>
            {canManage ? (
              <>
                <Button variant="secondary" onClick={() => setIsEditingProject((current) => !current)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={handleDeleteProject}>
                  Delete
                </Button>
              </>
            ) : null}
          </div>
        }
      />

      {action.error ? <div className="mb-5"><ErrorState message={action.error} /></div> : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-950">Details</h2>
              <Badge>{project?.status}</Badge>
            </div>
          </CardHeader>
          <CardBody>
            {isEditingProject ? (
              <ProjectForm
                isLoading={action.isLoading}
                project={project}
                onCancel={() => setIsEditingProject(false)}
                onSubmit={handleProjectUpdate}
              />
            ) : (
              <div className="space-y-4 text-sm text-slate-600">
                <p>{project?.description || 'No description'}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <p>Start: {formatDate(project?.startDate)}</p>
                  <p>Due: {formatDate(project?.dueDate)}</p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-950">Members</h2>
          </CardHeader>
          <CardBody>
            <ProjectMembers
              canManage={canManage}
              members={project?.memberIds || []}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
            />
          </CardBody>
        </Card>
      </div>

      <div className="mt-8">
        <SectionHeader
          eyebrow="Tasks"
          title="Project tasks"
          actions={
            canManage ? (
              <Button onClick={() => setIsCreatingTask((current) => !current)}>
                {isCreatingTask ? 'Close form' : 'New task'}
              </Button>
            ) : null
          }
        />

        {isCreatingTask ? (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="font-semibold text-slate-950">Create task</h2>
            </CardHeader>
            <CardBody>
              <TaskForm
                allowAssignment={canManage}
                isLoading={action.isLoading}
                onCancel={() => setIsCreatingTask(false)}
                onSubmit={handleCreateTask}
              />
            </CardBody>
          </Card>
        ) : null}

        <TaskFilters filters={filters} onChange={setFilters} />
        {tasksQuery.isLoading ? <EmptyState title="Loading tasks" description="Fetching project tasks." /> : null}
        {tasksQuery.error ? <ErrorState message={tasksQuery.error} /> : null}
        {!tasksQuery.isLoading && !tasksQuery.error && visibleTasks.length === 0 ? (
          <EmptyState title="No tasks found" description="Tasks matching your filters will appear here." />
        ) : null}
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
        <div className="mt-5">
          <Button variant="secondary" onClick={refreshAll}>
            Refresh project
          </Button>
        </div>
      </div>
    </>
  );
};
