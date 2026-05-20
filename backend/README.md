# Team Task Manager API

Express and MongoDB backend for Team Task Manager.

## Requirements

- Node.js 22+
- npm 10+
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

3. Update `MONGODB_URI` in `.env` if needed.

4. Start the development server:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/v1/health
```

The first registered user becomes an admin by default. Set `FIRST_USER_ADMIN=false` if you want
every signup to start as a member.

Authentication docs:

```text
docs/auth-api.md
```

RBAC docs:

```text
docs/rbac.md
```

Project API docs:

```text
docs/project-api.md
```

Task API docs:

```text
docs/task-api.md
```

Dashboard API docs:

```text
docs/dashboard-api.md
```

## Scripts

```text
npm run dev      Start the API with nodemon
npm start        Start the API with Node
npm run lint     Run ESLint
npm run format   Format files with Prettier
```
