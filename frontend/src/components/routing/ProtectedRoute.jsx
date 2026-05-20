import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuth } from '../../hooks/useAuth.js';
import { PageLoader } from '../ui/PageLoader.jsx';

export const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <PageLoader label="Checking your session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
