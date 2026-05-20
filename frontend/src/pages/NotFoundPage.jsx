import { Link } from 'react-router';

export const NotFoundPage = () => (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div className="max-w-md text-center">
      <p className="text-sm font-semibold text-brand-700">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
      <Link
        className="mt-6 inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        to="/dashboard"
      >
        Go to dashboard
      </Link>
    </div>
  </main>
);
