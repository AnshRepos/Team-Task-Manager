import { Navigate } from 'react-router';

import { useAuth } from '../../hooks/useAuth.js';
import { PageLoader } from '../ui/PageLoader.jsx';

export const AuthRedirectNotice = ({ children }) => {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <PageLoader label="Checking your session" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
