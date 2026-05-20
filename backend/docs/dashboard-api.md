# Dashboard API

Base URL:

```text
http://localhost:5000/api/v1/dashboard
```

All endpoints require:

```http
Authorization: Bearer jwt-access-token
```

## Get Dashboard

```http
GET /
```

Admins receive dashboard metrics for all tasks.

Members receive dashboard metrics scoped to tasks assigned to them.

Success:

```json
{
  "success": true,
  "message": "Dashboard fetched successfully",
  "data": {
    "scope": "all_tasks",
    "generatedAt": "2026-05-20T10:00:00.000Z",
    "summary": {
      "totalTasks": 24,
      "completedTasks": 8,
      "pendingTasks": 16,
      "overdueTasks": 3,
      "assignedToMe": 5
    },
    "tasksByStatus": [
      {
        "status": "to_do",
        "label": "To Do",
        "count": 10
      },
      {
        "status": "in_progress",
        "label": "In Progress",
        "count": 6
      },
      {
        "status": "done",
        "label": "Done",
        "count": 8
      }
    ],
    "projectSummaries": [
      {
        "project": {
          "id": "665f10000000000000000000",
          "name": "Website Redesign"
        },
        "totalTasks": 12,
        "completedTasks": 4,
        "pendingTasks": 8,
        "overdueTasks": 2,
        "tasksByStatus": [
          {
            "status": "to_do",
            "label": "To Do",
            "count": 5
          },
          {
            "status": "in_progress",
            "label": "In Progress",
            "count": 3
          },
          {
            "status": "done",
            "label": "Done",
            "count": 4
          }
        ]
      }
    ],
    "recentActivity": [
      {
        "id": "665f12000000000000000000",
        "title": "Design dashboard layout",
        "status": "in_progress",
        "statusLabel": "In Progress",
        "updatedAt": "2026-05-20T09:45:00.000Z",
        "project": {
          "id": "665f10000000000000000000",
          "name": "Website Redesign"
        },
        "assignee": {
          "id": "665f0f000000000000000000",
          "name": "Member User",
          "email": "member@example.com"
        }
      }
    ]
  }
}
```

## Query Strategy

The dashboard uses one MongoDB aggregation with `$facet` to return:

- Total tasks.
- Tasks grouped by status.
- Completed task count.
- Pending task count.
- Overdue task count.
- Tasks assigned to the logged-in user.
- Project-wise summaries.
- Recent task activity.

Overdue tasks are counted as:

```text
dueDate < current server time AND status != done
```
