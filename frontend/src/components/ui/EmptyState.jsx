export const EmptyState = ({ action, description, title }) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
    <p className="text-base font-semibold text-slate-950">{title}</p>
    {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);
