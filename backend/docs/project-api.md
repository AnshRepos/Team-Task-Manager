# Project Management API

Base URL:

```text
http://localhost:5000/api/v1/projects
```

All endpoints require:

```http
Authorization: Bearer jwt-access-token
```

## Permission Summary

Admins can:

- Create projects.
- Update projects.
- Delete projects.
- Add project members.
- Remove project members.
- View every project.

Members can:

- View only projects where their user ID is in `memberIds`.
- Not create, update, delete, or manage project members.

## Create Project

Admin only.

```http
POST /
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Refresh the marketing website.",
  "status": "active",
  "startDate": "2026-05-20T00:00:00.000Z",
  "dueDate": "2026-06-20T00:00:00.000Z",
  "memberIds": ["665f0f000000000000000000"]
}
```

Success:

```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "project": {
      "name": "Website Redesign",
      "description": "Refresh the marketing website.",
      "status": "active",
      "startDate": "2026-05-20T00:00:00.000Z",
      "dueDate": "2026-06-20T00:00:00.000Z",
      "createdBy": {
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin",
        "id": "665f0e000000000000000000"
      },
      "memberIds": [
        {
          "name": "Member User",
          "email": "member@example.com",
          "role": "member",
          "id": "665f0f000000000000000000"
        }
      ],
      "createdAt": "2026-05-20T10:00:00.000Z",
      "updatedAt": "2026-05-20T10:00:00.000Z",
      "id": "665f10000000000000000000"
    }
  }
}
```

## Get Projects For Current User

Admins receive all projects. Members receive assigned projects only.

```http
GET /
```

Success:

```json
{
  "success": true,
  "message": "Projects fetched successfully",
  "data": {
    "projects": []
  }
}
```

## Get One Project

```http
GET /:projectId
```

Members can access only assigned projects.

Unauthorized:

```json
{
  "success": false,
  "error": {
    "message": "You do not have permission to access this project"
  }
}
```

## Update Project

Admin only.

```http
PATCH /:projectId
Content-Type: application/json

{
  "name": "Website Redesign Phase 2",
  "status": "planned"
}
```

Success:

```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "project": {}
  }
}
```

## Delete Project

Admin only.

```http
DELETE /:projectId
```

Success:

```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": {
    "projectId": "665f10000000000000000000"
  }
}
```

## Add Member

Admin only.

```http
POST /:projectId/members
Content-Type: application/json

{
  "userId": "665f0f000000000000000000"
}
```

Possible edge-case response:

```json
{
  "success": false,
  "error": {
    "message": "User is already a project member"
  }
}
```

## Remove Member

Admin only.

```http
DELETE /:projectId/members/:userId
```

Possible edge-case response:

```json
{
  "success": false,
  "error": {
    "message": "User is not a project member"
  }
}
```

## Validation Error

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "path": "params.projectId",
        "message": "Invalid MongoDB ObjectId"
      }
    ]
  }
}
```
