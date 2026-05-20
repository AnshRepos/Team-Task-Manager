const variants = {
  default: 'border-slate-200 bg-slate-50 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
};

export const Badge = ({ children, variant = 'default' }) => (
  <span
    className={['inline-flex rounded-md border px-2.5 py-1 text-xs font-medium', variants[variant]].join(
      ' ',
    )}
  >
    {children}
  </span>
);
