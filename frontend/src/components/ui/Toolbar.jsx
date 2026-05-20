export const Toolbar = ({ children }) => (
  <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end md:justify-between">
    {children}
  </div>
);
