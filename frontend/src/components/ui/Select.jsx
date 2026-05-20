export const Select = ({ children, error, id, label, ...props }) => (
  <div className="space-y-1.5">
    {label ? (
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
    ) : null}
    <select
      id={id}
      className={[
        'block min-h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-950 shadow-sm transition',
        'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100',
        error ? 'border-red-400' : 'border-slate-300',
      ].join(' ')}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    >
      {children}
    </select>
    {error ? (
      <p id={`${id}-error`} className="text-sm text-red-600">
        {error}
      </p>
    ) : null}
  </div>
);
