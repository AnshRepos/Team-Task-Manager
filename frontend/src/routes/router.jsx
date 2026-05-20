import { createBrowserRouter, Navigate } from 'react-router';

import { AppLayout } from '../components/layout/AppLayout.jsx';
import { AuthLayout } from '../components/layout/AuthLayout.jsx';
import { ProtectedRoute } from '../components/routing/ProtectedRoute.jsx';
import { DashboardPage } from '../pages/DashboardPage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';
import { ProjectDetailsPage } from '../pages/ProjectDetailsPage.jsx';
import { ProjectsPage } from '../pages/ProjectsPage.jsx';
import { SignupPage } from '../pages/SignupPage.jsx';
import { TaskDetailsPage } from '../pages/TaskDetailsPage.jsx';
import { TasksPage } from '../pages/TasksPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/projects',
            element: <ProjectsPage />,
          },
          {
            path: '/projects/:projectId',
            element: <ProjectDetailsPage />,
          },
          {
            path: '/tasks',
            element: <TasksPage />,
          },
          {
            path: '/tasks/:taskId',
            element: <TaskDetailsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
