import { Outlet } from 'react-router';

import { AuthRedirectNotice } from '../auth/AuthRedirectNotice.jsx';

export const AuthLayout = () => (
  <AuthRedirectNotice>
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-slate-950 px-8 py-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-200">Team Task Manager</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal">
              Keep projects, tasks, and ownership clear.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              A focused workspace for small teams to plan work, assign tasks, and track progress
              without clutter.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-slate-300">
            <div className="rounded-md border border-white/10 bg-white/5 p-4">
              Role-aware access for admins and members
            </div>
            <div className="rounded-md border border-white/10 bg-white/5 p-4">
              Project and task APIs ready for production workflows
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-5 py-8 sm:px-8 md:px-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-7 md:hidden">
              <p className="text-2xl font-semibold text-slate-950">Team Task Manager</p>
              <p className="mt-2 text-sm text-slate-600">Plan work with a clean team dashboard.</p>
            </div>

            <Outlet />
          </div>
        </section>
      </div>
    </main>
  </AuthRedirectNotice>
);
