export const SectionHeader = ({ actions, eyebrow, title }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      {eyebrow ? <p className="text-sm font-medium text-brand-700">{eyebrow}</p> : null}
      <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">{title}</h1>
    </div>
    {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
  </div>
);
