const SkeletonBlock = ({ className = '' }) => (
  <div className={['animate-pulse rounded-lg bg-slate-200', className].join(' ')} />
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonBlock key={index} className="h-32" />
      ))}
    </div>
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <SkeletonBlock className="h-80" />
      <SkeletonBlock className="h-80" />
    </div>
    <SkeletonBlock className="h-80" />
  </div>
);
