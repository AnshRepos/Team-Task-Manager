import { NavLink, Outlet } from 'react-router';

import { useAsyncAction } from '../../hooks/useAsyncAction.js';
import { useAuth } from '../../hooks/useAuth.js';
import { Button } from '../ui/Button.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'My Tasks' },
];

export const AppLayout = () => {
  const { logout, user } = useAuth();
  const { isLoading, run } = useAsyncAction();

  const handleLogout = () => {
    run(logout);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="page-shell flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <p className="text-lg font-semibold text-slate-950">Team Task Manager</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>

          <nav className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 p-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'rounded px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-white text-brand-700 shadow-sm'
                      : 'text-slate-600 hover:bg-white hover:text-slate-950',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Button
            variant="secondary"
            isLoading={isLoading}
            loadingLabel="Logging out..."
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="page-shell py-8">
        <Outlet />
      </main>
    </div>
  );
};
