import { useMemo, useState } from 'react';

import { projectsApi } from '../api/projectsApi.js';
import { ProjectCard } from '../components/projects/ProjectCard.jsx';
import { ProjectForm } from '../components/projects/ProjectForm.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { Input } from '../components/ui/Input.jsx';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Toolbar } from '../components/ui/Toolbar.jsx';
import { useAsyncAction } from '../hooks/useAsyncAction.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { useAuth } from '../hooks/useAuth.js';

export const ProjectsPage = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'admin';
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');
  const { data, error, isLoading, refetch } = useAsyncData(projectsApi.list);
  const createAction = useAsyncAction();

  const filteredProjects = useMemo(
    () => {
      const projects = data?.projects || [];
      return projects.filter((project) =>
        `${project.name} ${project.description}`.toLowerCase().includes(search.toLowerCase()),
      );
    },
    [data?.projects, search],
  );

  const handleCreate = async (payload) => {
    await createAction.run(async () => {
      await projectsApi.create(payload);
      setIsCreating(false);
      await refetch();
    });
  };

  return (
    <>
      <SectionHeader
        eyebrow="Projects"
        title="Project workspace"
        actions={
          canManage ? (
            <Button onClick={() => setIsCreating((current) => !current)}>
              {isCreating ? 'Close form' : 'New project'}
            </Button>
          ) : null
        }
      />

      {isCreating ? (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="font-semibold text-slate-950">Create project</h2>
          </CardHeader>
          <CardBody>
            {createAction.error ? <ErrorState message={createAction.error} /> : null}
            <div className={createAction.error ? 'mt-4' : ''}>
              <ProjectForm
                isLoading={createAction.isLoading}
                onCancel={() => setIsCreating(false)}
                onSubmit={handleCreate}
              />
            </div>
          </CardBody>
        </Card>
      ) : null}

      <Toolbar>
        <div className="w-full md:max-w-md">
          <Input
            id="project-search"
            label="Search projects"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or description"
          />
        </div>
        <Button variant="secondary" onClick={refetch}>
          Refresh
        </Button>
      </Toolbar>

      {isLoading ? <EmptyState title="Loading projects" description="Fetching your workspace." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && filteredProjects.length === 0 ? (
        <EmptyState title="No projects found" description="Create or join a project to see it here." />
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
};
