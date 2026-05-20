export const Card = ({ children, className = '' }) => (
  <section className={['rounded-lg border border-slate-200 bg-white shadow-sm', className].join(' ')}>
    {children}
  </section>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={['border-b border-slate-200 px-5 py-4', className].join(' ')}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={['px-5 py-4', className].join(' ')}>{children}</div>
);
