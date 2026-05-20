# Role-Based Access Control

Team Task Manager currently supports two roles:

```text
admin
member
```

## Permission Rules

Admins can:

- Create, update, and delete projects.
- Manage members.
- Create tasks.
- Assign tasks.
- View all projects and tasks.
- Update any task status.

Members can:

- View only projects they belong to.
- View only tasks assigned to them.
- Update task status only when the task is assigned to them and status updates are not locked.

Unauthorized actions return:

```json
{
  "success": false,
  "error": {
    "message": "You do not have permission to perform this action"
  }
}
```

Missing authentication returns:

```json
{
  "success": false,
  "error": {
    "message": "Authentication token is required"
  }
}
```

## Protected Route Examples

These examples are available under:

```text
/api/v1/rbac-examples
```

Admin-only project creation:

```http
POST /api/v1/rbac-examples/projects
Authorization: Bearer jwt-access-token
```

Admin-only member management:

```http
PATCH /api/v1/rbac-examples/members/:memberId
Authorization: Bearer jwt-access-token
```

Member or admin viewing an assigned task:

```http
GET /api/v1/rbac-examples/tasks/:taskId
Authorization: Bearer jwt-access-token
```

Member or admin updating task status:

```http
PATCH /api/v1/rbac-examples/tasks/:taskId/status
Authorization: Bearer jwt-access-token
```

In real task routes, load the task from MongoDB before calling `requireTaskAccess()` or
`requireTaskStatusUpdateAccess()`.
