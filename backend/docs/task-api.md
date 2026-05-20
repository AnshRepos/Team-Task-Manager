# Task Management API

Base URL:

```text
http://localhost:5000/api/v1/tasks
```

All endpoints require:

```http
Authorization: Bearer jwt-access-token
```

## Status Values

Use these API values:

```text
to_do
in_progress
done
```

Responses also include:

```json
{
  "statusLabel": "To Do"
}
```

## Permission Summary

Admins can:

- Create tasks.
- Assign and unassign tasks.
- Update task title, description, due date, status, and status lock.
- Delete tasks.
- View every task in every project.

Members can:

- View tasks assigned to them.
- View their assigned tasks within projects they belong to.
- Update only the status of assigned tasks when `statusUpdateLocked` is `false`.

## Create Task

Admin only. The assignee must already be a member of the project.

```http
POST /project/:projectId
Content-Type: application/json

{
  "title": "Design dashboard layout",
  "description": "Create the first responsive dashboard draft.",
  "status": "to_do",
  "dueDate": "2026-05-25T18:00:00.000Z",
  "assigneeId": "665f0f000000000000000000"
}
```

Success:

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "projectId": {
        "name": "Website Redesign",
        "description": "Refresh the marketing website.",
        "status": "active",
        "memberIds": ["665f0f000000000000000000"],
        "id": "665f10000000000000000000"
      },
      "title": "Design dashboard layout",
      "description": "Create the first responsive dashboard draft.",
      "status": "to_do",
      "statusLabel": "To Do",
      "dueDate": "2026-05-25T18:00:00.000Z",
      "assigneeId": {
        "name": "Member User",
        "email": "member@example.com",
        "role": "member",
        "id": "665f0f000000000000000000"
      },
      "statusUpdateLocked": false,
      "isOverdue": false,
      "id": "665f12000000000000000000"
    }
  }
}
```

Unsafe assignment:

```json
{
  "success": false,
  "error": {
    "message": "Assignee must be a member of the project"
  }
}
```

## Get Tasks By Project

Admins receive all tasks in the project. Members receive only their assigned tasks.

```http
GET /project/:projectId
```

Filter by status:

```http
GET /project/:projectId?status=in_progress
```

Filter overdue tasks:

```http
GET /project/:projectId?overdue=true
```

Success:

```json
{
  "success": true,
  "message": "Project tasks fetched successfully",
  "data": {
    "tasks": []
  }
}
```

## Get Assigned Tasks

Current user:

```http
GET /assigned/me
```

Specific user:

```http
GET /assigned/:userId
```

Admins can fetch any user. Members can fetch only themselves.

With filters:

```http
GET /assigned/me?status=to_do&overdue=false
```

## Get One Task

```http
GET /:taskId
```

Members can access only assigned tasks.

## Update Task

Admin only.

```http
PATCH /:taskId
Content-Type: application/json

{
  "title": "Design dashboard layout v2",
  "description": "Update the draft with mobile states.",
  "dueDate": "2026-05-28T18:00:00.000Z",
  "status": "in_progress"
}
```

Success:

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {}
  }
}
```

## Assign Task

Admin only. Set `assigneeId` to `null` to unassign.

```http
PATCH /:taskId/assign
Content-Type: application/json

{
  "assigneeId": "665f0f000000000000000000"
}
```

Success:

```json
{
  "success": true,
  "message": "Task assigned successfully",
  "data": {
    "task": {}
  }
}
```

## Update Task Status

Admins can update any task status. Members can update only their assigned task when status updates are not locked.

```http
PATCH /:taskId/status
Content-Type: application/json

{
  "status": "done"
}
```

Blocked member response:

```json
{
  "success": false,
  "error": {
    "message": "You do not have permission to update this task status"
  }
}
```

## Delete Task

Admin only.

```http
DELETE /:taskId
```

Success:

```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "taskId": "665f12000000000000000000"
  }
}
```

## Overdue Logic

`isOverdue` is computed when the task is returned:

```text
dueDate is before the current server time AND status is not done
```

This keeps overdue detection accurate without storing stale `isOverdue` values in MongoDB.
