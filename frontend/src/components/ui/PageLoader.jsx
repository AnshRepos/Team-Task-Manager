export const PageLoader = ({ label = 'Loading' }) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
  </div>
);
