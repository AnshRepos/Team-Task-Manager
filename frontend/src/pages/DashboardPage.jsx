import { dashboardApi } from '../api/dashboardApi.js';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton.jsx';
import { ProjectSummaryList } from '../components/dashboard/ProjectSummaryList.jsx';
import { RecentTasksList } from '../components/dashboard/RecentTasksList.jsx';
import { StatCard } from '../components/dashboard/StatCard.jsx';
import { StatusBreakdown } from '../components/dashboard/StatusBreakdown.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';

export const DashboardPage = () => {
  const { data, error, isLoading, refetch } = useAsyncData(dashboardApi.getDashboard);

  if (isLoading) {
    return (
      <>
        <SectionHeader eyebrow="Overview" title="Dashboard" />
        <DashboardSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <SectionHeader
          eyebrow="Overview"
          title="Dashboard"
          actions={
            <Button variant="secondary" onClick={refetch}>
              Retry
            </Button>
          }
        />
        <ErrorState message={error} />
      </>
    );
  }

  const summary = data?.summary || {};
  const totalTasks = summary.totalTasks || 0;

  return (
    <>
      <SectionHeader
        eyebrow={data?.scope === 'all_tasks' ? 'Team overview' : 'My overview'}
        title="Dashboard"
        actions={
          <Button variant="secondary" onClick={refetch}>
            Refresh
          </Button>
        }
      />

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard accent="blue" label="Total tasks" value={summary.totalTasks || 0} />
          <StatCard accent="emerald" label="Completed" value={summary.completedTasks || 0} />
          <StatCard accent="amber" label="Pending" value={summary.pendingTasks || 0} />
          <StatCard accent="red" label="Overdue" value={summary.overdueTasks || 0} />
          <StatCard accent="slate" label="Assigned to me" value={summary.assignedToMe || 0} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <StatusBreakdown statuses={data?.tasksByStatus || []} totalTasks={totalTasks} />
          <ProjectSummaryList projects={data?.projectSummaries || []} />
        </div>

        <RecentTasksList tasks={data?.recentActivity || []} />
      </div>
    </>
  );
};
