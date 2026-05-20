import { useCallback, useMemo, useState } from 'react';

import { tasksApi } from '../api/tasksApi.js';
import { TaskCard } from '../components/tasks/TaskCard.jsx';
import { TaskFilters } from '../components/tasks/TaskFilters.jsx';
import { Button } from '../components/ui/Button.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';

export const TasksPage = () => {
  const [filters, setFilters] = useState({ search: '', status: '', overdue: '' });
  const loadTasks = useCallback(
    () =>
      tasksApi.assignedToMe({
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.overdue ? { overdue: filters.overdue } : {}),
      }),
    [filters.status, filters.overdue],
  );
  const { data, error, isLoading, refetch } = useAsyncData(loadTasks);

  const visibleTasks = useMemo(
    () => {
      const tasks = data?.tasks || [];
      return tasks.filter((task) =>
        `${task.title} ${task.description} ${task.projectId?.name || ''}`
          .toLowerCase()
          .includes(filters.search.toLowerCase()),
      );
    },
    [data?.tasks, filters.search],
  );

  return (
    <>
      <SectionHeader
        eyebrow="Tasks"
        title="My tasks"
        actions={
          <Button variant="secondary" onClick={refetch}>
            Refresh
          </Button>
        }
      />
      <TaskFilters filters={filters} onChange={setFilters} />
      {isLoading ? <EmptyState title="Loading tasks" description="Fetching your assigned tasks." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && visibleTasks.length === 0 ? (
        <EmptyState title="No tasks found" description="Assigned tasks matching your filters will appear here." />
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {visibleTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </>
  );
};
