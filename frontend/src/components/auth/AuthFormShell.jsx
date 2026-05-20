export const AuthFormShell = ({ children, footer, subtitle, title }) => (
  <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-6 py-5">
      <h1 className="text-xl font-semibold text-slate-950">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
    </div>
    <div className="px-6 py-5">{children}</div>
    {footer ? <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">{footer}</div> : null}
  </section>
);
