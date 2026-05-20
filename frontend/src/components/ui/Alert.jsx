const variants = {
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export const Alert = ({ children, variant = 'info' }) => (
  <div className={['rounded-md border px-4 py-3 text-sm', variants[variant]].join(' ')} role="alert">
    {children}
  </div>
);
