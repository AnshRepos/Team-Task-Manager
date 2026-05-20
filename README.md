# Team Task Manager

A production-ready full-stack web application for managing team projects, assigning tasks, tracking status, and viewing team productivity from a clean dashboard.

Team Task Manager is built as a practical student-friendly project with professional architecture, secure authentication, role-based access control, reusable frontend components, and deployment-ready configuration for Vercel.

## Features

- User signup and login
- JWT-based authentication
- Admin and Member roles
- Protected frontend routes
- Project creation, editing, deletion, and member management
- Task creation, editing, assignment, deletion, and status updates
- Task statuses: To Do, In Progress, Done
- Overdue task detection
- Dashboard with task counts, status breakdowns, project summaries, and recent activity
- Responsive React UI
- MongoDB Atlas-ready backend
- Vercel deployment configuration

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- Context API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Zod validation

### Tooling

- ESLint
- Prettier
- Vercel
- MongoDB Atlas

## Project Structure

```text
team-task-manager/
  backend/
    api/
      index.js
    docs/
    src/
      config/
      constants/
      controllers/
      middleware/
      models/
      routes/
      utils/
      validators/
    package.json
    vercel.json

  frontend/
    src/
      api/
      components/
      config/
      constants/
      context/
      hooks/
      pages/
      routes/
      styles/
      utils/
    package.json
    vercel.json

  package.json
  README.md
```

## Roles and Permissions

### Admin

- Create, update, and delete projects
- Add and remove project members
- Create, update, assign, and delete tasks
- View all projects and tasks
- Update any task status

### Member

- View assigned projects and tasks
- View tasks assigned to them
- Update task status only when allowed
- Cannot create projects or manage members

The first registered user becomes an admin by default when:

```text
FIRST_USER_ADMIN=true
```

After creating the first admin in production, set it to:

```text
FIRST_USER_ADMIN=false
```

## Backend API Overview

Base URL:

```text
http://localhost:5000/api/v1
```

Main endpoints:

```text
POST   /auth/signup
POST   /auth/login
GET    /auth/me
POST   /auth/logout

GET    /dashboard

GET    /projects
POST   /projects
GET    /projects/:projectId
PATCH  /projects/:projectId
DELETE /projects/:projectId
POST   /projects/:projectId/members
DELETE /projects/:projectId/members/:userId

GET    /tasks/project/:projectId
POST   /tasks/project/:projectId
GET    /tasks/assigned/me
GET    /tasks/:taskId
PATCH  /tasks/:taskId
DELETE /tasks/:taskId
PATCH  /tasks/:taskId/assign
PATCH  /tasks/:taskId/status
```

Detailed API examples are available in:

```text
backend/docs/
```

## Local Development

### Prerequisites

- Node.js 22 or newer
- npm 10 or newer
- MongoDB local instance or MongoDB Atlas connection string

### 1. Clone the project

```bash
git clone <your-repository-url>
cd team-task-manager
```

### 2. Install backend dependencies

```bash
cd backend
npm install
copy .env.example .env
```

Update `backend/.env`:

```text
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/team-task-manager
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=12
CORS_ORIGINS=http://localhost:5173
CLIENT_URL=http://localhost:5173
FIRST_USER_ADMIN=true
```

Start backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/v1/health
```

### 3. Install frontend dependencies

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env
```

Update `frontend/.env`:

```text
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Start frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Root Scripts

From the project root:

```bash
npm run dev:backend
npm run dev:frontend
npm run build:frontend
npm run lint:backend
npm run lint:frontend
```

## Environment Variables

### Backend

```text
NODE_ENV
PORT
MONGODB_URI
JWT_SECRET
JWT_EXPIRES_IN
BCRYPT_SALT_ROUNDS
CLIENT_URL
CORS_ORIGINS
REQUEST_BODY_LIMIT
LOG_FORMAT
FIRST_USER_ADMIN
```

### Frontend

```text
VITE_API_BASE_URL
```

## Deployment

This project is prepared for Vercel deployment using two separate Vercel projects:

```text
backend  -> Express API as a Vercel Function
frontend -> Vite static frontend
```

### Backend on Vercel

Set the Vercel project root directory to:

```text
backend
```

Use:

```text
Framework Preset: Other
Build Command: npm install
Output Directory: leave empty
```

Required environment variables:

```text
NODE_ENV=production
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<long secure random secret>
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=12
CORS_ORIGINS=https://your-frontend.vercel.app
CLIENT_URL=https://your-frontend.vercel.app
FIRST_USER_ADMIN=true
```

### Frontend on Vercel

Set the Vercel project root directory to:

```text
frontend
```

Use:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Required environment variable:

```text
VITE_API_BASE_URL=https://your-backend.vercel.app/api/v1
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account.
2. Create a new project.
3. Create a cluster.
4. Create a database user with a strong password.
5. Add network access.
6. For Vercel serverless deployments, use:

```text
0.0.0.0/0
```

7. Copy the Atlas connection string.
8. Add it to Vercel as `MONGODB_URI`.

Use a `mongodb+srv://` connection string.

## Validation and Security

- Passwords are hashed with bcrypt
- JWT tokens are required for protected routes
- Backend input validation uses Zod
- CORS is restricted by configured origins
- Protected actions are checked on the backend
- Members cannot perform admin-only actions
- Duplicate accounts are blocked
- Project/task ownership rules are enforced
- Expired frontend sessions are cleared on unauthorized API responses

## Testing and Quality Checks

Backend:

```bash
cd backend
npm run lint
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

The latest review pass completed successfully with:

```text
Backend lint passing
Backend syntax checks passing
Frontend lint passing
Frontend production build passing
```

## Common Issues

### CORS origin is not allowed

Make sure backend `CORS_ORIGINS` matches the exact frontend URL.

```text
CORS_ORIGINS=https://your-frontend.vercel.app
```

### MongoDB connection fails

Check:

- `MONGODB_URI` is correct
- Atlas database user exists
- Atlas Network Access allows your deployment
- Password special characters are URL encoded

### Frontend cannot reach backend

Check:

```text
VITE_API_BASE_URL=https://your-backend.vercel.app/api/v1
```

Then redeploy the frontend.

### Project creation is forbidden

Only admins can create projects. Make sure the first production user was created while:

```text
FIRST_USER_ADMIN=true
```

## Production Checklist

- MongoDB Atlas cluster created
- Atlas database user created
- Atlas Network Access configured
- Backend deployed
- Frontend deployed
- Backend `MONGODB_URI` configured
- Backend `JWT_SECRET` configured
- Backend `CORS_ORIGINS` points to frontend URL
- Frontend `VITE_API_BASE_URL` points to backend `/api/v1`
- First admin account created
- `FIRST_USER_ADMIN=false` after first admin creation
- Signup works
- Login works
- Dashboard loads
- Admin can create projects
- Admin can create and assign tasks
- Member can view assigned tasks
- Member cannot access admin-only actions

## Author

Team Task Manager was built as a full-stack project submission using modern React, Express, MongoDB, and Vercel-ready deployment practices.
