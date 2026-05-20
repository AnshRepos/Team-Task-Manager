const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-brand-600',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
};

export const Button = ({
  children,
  className = '',
  disabled = false,
  isLoading = false,
  loadingLabel = 'Loading...',
  type = 'button',
  variant = 'primary',
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    aria-busy={isLoading}
    className={[
      'inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-60',
      variants[variant],
      className,
    ].join(' ')}
    {...props}
  >
    {isLoading ? (
      <>
        <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        {loadingLabel}
      </>
    ) : (
      children
    )}
  </button>
);
