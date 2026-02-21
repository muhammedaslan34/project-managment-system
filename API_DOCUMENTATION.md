# Project Management System - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": { ... }
  }
}
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "member",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /api/auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "member",
      "avatar_url": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### GET /api/auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "member",
    "avatar_url": null,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## Project Management Endpoints

### GET /api/projects
Get all projects with optional filters.

**Query Parameters:**
- `team_id` (optional): Filter by team ID
- `status` (optional): Filter by status (planning, active, on_hold, completed, archived)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "team_id": "uuid",
      "name": "Website Redesign",
      "description": "Complete redesign of company website",
      "status": "active",
      "priority": "high",
      "start_date": "2024-01-01",
      "due_date": "2024-03-31",
      "created_by": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "team": {
        "id": "uuid",
        "name": "Development Team"
      },
      "creator": {
        "id": "uuid",
        "full_name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

### POST /api/projects
Create a new project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "team_id": "uuid",
  "name": "Mobile App Development",
  "description": "Build iOS and Android applications",
  "status": "planning",
  "priority": "high",
  "start_date": "2024-02-01",
  "due_date": "2024-06-30"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "team_id": "uuid",
    "name": "Mobile App Development",
    "description": "Build iOS and Android applications",
    "status": "planning",
    "priority": "high",
    "start_date": "2024-02-01",
    "due_date": "2024-06-30",
    "created_by": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/projects/[id]
Get a specific project by ID with detailed information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "team_id": "uuid",
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "status": "active",
    "priority": "high",
    "start_date": "2024-01-01",
    "due_date": "2024-03-31",
    "created_by": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "team": {
      "id": "uuid",
      "name": "Development Team",
      "description": "Frontend and Backend developers"
    },
    "creator": {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com",
      "avatar_url": null
    },
    "tasks": [
      {
        "id": "uuid",
        "title": "Design homepage mockup",
        "status": "in_progress",
        "priority": "high",
        "assigned_to": "uuid",
        "due_date": "2024-01-15T00:00:00Z"
      }
    ]
  }
}
```

### PATCH /api/projects/[id]
Update a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "on_hold",
  "priority": "medium"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "on_hold",
    "priority": "medium",
    ...
  }
}
```

### DELETE /api/projects/[id]
Delete a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Project deleted successfully"
  }
}
```

---

## Task Management Endpoints

### GET /api/tasks
Get all tasks with optional filters.

**Query Parameters:**
- `project_id` (optional): Filter by project ID
- `assigned_to` (optional): Filter by assigned user ID
- `status` (optional): Filter by status (todo, in_progress, review, done)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "project_id": "uuid",
      "title": "Implement user authentication",
      "description": "Add JWT-based authentication system",
      "status": "in_progress",
      "priority": "high",
      "assigned_to": "uuid",
      "created_by": "uuid",
      "due_date": "2024-01-20T00:00:00Z",
      "estimated_hours": 16,
      "actual_hours": null,
      "parent_task_id": null,
      "position": 0,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "project": {
        "id": "uuid",
        "name": "Website Redesign",
        "status": "active"
      },
      "assignee": {
        "id": "uuid",
        "full_name": "Jane Smith",
        "email": "jane@example.com",
        "avatar_url": null
      },
      "creator": {
        "id": "uuid",
        "full_name": "John Doe",
        "email": "john@example.com"
      },
      "subtasks": []
    }
  ]
}
```

### POST /api/tasks
Create a new task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "project_id": "uuid",
  "title": "Design database schema",
  "description": "Create ER diagram and SQL schema",
  "status": "todo",
  "priority": "high",
  "assigned_to": "uuid",
  "due_date": "2024-01-25T00:00:00Z",
  "estimated_hours": 8,
  "position": 0
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "project_id": "uuid",
    "title": "Design database schema",
    "description": "Create ER diagram and SQL schema",
    "status": "todo",
    "priority": "high",
    "assigned_to": "uuid",
    "created_by": "uuid",
    "due_date": "2024-01-25T00:00:00Z",
    "estimated_hours": 8,
    "actual_hours": null,
    "parent_task_id": null,
    "position": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/tasks/[id]
Get a specific task by ID with detailed information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "project_id": "uuid",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication system",
    "status": "in_progress",
    "priority": "high",
    "assigned_to": "uuid",
    "created_by": "uuid",
    "due_date": "2024-01-20T00:00:00Z",
    "estimated_hours": 16,
    "actual_hours": 10,
    "parent_task_id": null,
    "position": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z",
    "project": {
      "id": "uuid",
      "name": "Website Redesign",
      "status": "active",
      "team_id": "uuid"
    },
    "assignee": {
      "id": "uuid",
      "full_name": "Jane Smith",
      "email": "jane@example.com",
      "avatar_url": null
    },
    "creator": {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com"
    },
    "subtasks": [],
    "dependencies": [],
    "comments": [
      {
        "id": "uuid",
        "content": "Making good progress on this",
        "created_at": "2024-01-10T00:00:00Z",
        "user": {
          "id": "uuid",
          "full_name": "Jane Smith",
          "avatar_url": null
        }
      }
    ]
  }
}
```

### PATCH /api/tasks/[id]
Update a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "done",
  "actual_hours": 14
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "done",
    "actual_hours": 14,
    ...
  }
}
```

### DELETE /api/tasks/[id]
Delete a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Task deleted successfully"
  }
}
```

---

## Calendar & Events Endpoints

### GET /api/calendar/events
Get all calendar events with optional filters.

**Query Parameters:**
- `team_id` (optional): Filter by team ID
- `project_id` (optional): Filter by project ID
- `start_date` (optional): Filter events starting from this date
- `end_date` (optional): Filter events ending before this date
- `event_type` (optional): Filter by type (meeting, deadline, milestone, reminder)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "team_id": "uuid",
      "project_id": "uuid",
      "task_id": null,
      "title": "Sprint Planning Meeting",
      "description": "Plan tasks for the next sprint",
      "event_type": "meeting",
      "start_time": "2024-01-15T10:00:00Z",
      "end_time": "2024-01-15T11:00:00Z",
      "location": "https://meet.google.com/abc-defg-hij",
      "created_by": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "team": {
        "id": "uuid",
        "name": "Development Team"
      },
      "project": {
        "id": "uuid",
        "name": "Website Redesign"
      },
      "creator": {
        "id": "uuid",
        "full_name": "John Doe",
        "email": "john@example.com",
        "avatar_url": null
      },
      "attendees": [
        {
          "id": "uuid",
          "status": "accepted",
          "user": {
            "id": "uuid",
            "full_name": "Jane Smith",
            "email": "jane@example.com",
            "avatar_url": null
          }
        }
      ]
    }
  ]
}
```

### POST /api/calendar/events
Create a new calendar event.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "team_id": "uuid",
  "project_id": "uuid",
  "title": "Project Review Meeting",
  "description": "Review project progress and milestones",
  "event_type": "meeting",
  "start_time": "2024-01-20T14:00:00Z",
  "end_time": "2024-01-20T15:30:00Z",
  "location": "Conference Room A"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "team_id": "uuid",
    "project_id": "uuid",
    "title": "Project Review Meeting",
    "description": "Review project progress and milestones",
    "event_type": "meeting",
    "start_time": "2024-01-20T14:00:00Z",
    "end_time": "2024-01-20T15:30:00Z",
    "location": "Conference Room A",
    "created_by": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/calendar/events/[id]
Get a specific event by ID.

### PATCH /api/calendar/events/[id]
Update an event.

### DELETE /api/calendar/events/[id]
Delete an event.

---

## Team Management Endpoints

### GET /api/teams
Get all teams with members and projects.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Development Team",
      "description": "Frontend and Backend developers",
      "owner_id": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "owner": {
        "id": "uuid",
        "full_name": "John Doe",
        "email": "john@example.com",
        "avatar_url": null
      },
      "members": [
        {
          "id": "uuid",
          "role": "owner",
          "joined_at": "2024-01-01T00:00:00Z",
          "user": {
            "id": "uuid",
            "full_name": "John Doe",
            "email": "john@example.com",
            "avatar_url": null
          }
        }
      ],
      "projects": [
        {
          "id": "uuid",
          "name": "Website Redesign",
          "status": "active",
          "priority": "high"
        }
      ]
    }
  ]
}
```

### POST /api/teams
Create a new team.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Marketing Team",
  "description": "Marketing and content creation team"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Marketing Team",
    "description": "Marketing and content creation team",
    "owner_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/teams/[id]
Get a specific team by ID with detailed information.

### PATCH /api/teams/[id]
Update a team.

### DELETE /api/teams/[id]
Delete a team.

### POST /api/teams/[id]/members
Add a member to a team.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "user_id": "uuid",
  "role": "member"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "role": "member",
    "joined_at": "2024-01-01T00:00:00Z",
    "user": {
      "id": "uuid",
      "full_name": "Alice Johnson",
      "email": "alice@example.com",
      "avatar_url": null
    }
  }
}
```

---

## Notifications Endpoints

### GET /api/notifications
Get user notifications.

**Query Parameters:**
- `unread_only` (optional): Set to "true" to get only unread notifications
- `limit` (optional): Number of notifications to return (default: 50)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "task_assigned",
      "title": "New Task Assigned",
      "message": "You have been assigned to task: Design database schema",
      "related_entity_type": "task",
      "related_entity_id": "uuid",
      "is_read": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### PATCH /api/notifications/[id]/read
Mark a notification as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "is_read": true,
    ...
  }
}
```

---

## Comments Endpoints

### GET /api/comments
Get comments for a project or task.

**Query Parameters:**
- `project_id` (optional): Get comments for a specific project
- `task_id` (optional): Get comments for a specific task

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "project_id": null,
      "task_id": "uuid",
      "content": "Great progress on this task!",
      "created_at": "2024-01-10T00:00:00Z",
      "updated_at": "2024-01-10T00:00:00Z",
      "user": {
        "id": "uuid",
        "full_name": "John Doe",
        "email": "john@example.com",
        "avatar_url": null
      }
    }
  ]
}
```

### POST /api/comments
Create a new comment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "task_id": "uuid",
  "content": "This looks great! Ready for review."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "task_id": "uuid",
    "content": "This looks great! Ready for review.",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "user": {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com",
      "avatar_url": null
    }
  }
}
```

---

## Real-time Updates

The system supports real-time updates using Supabase Realtime. Subscribe to changes using the provided realtime utility functions in `lib/realtime.ts`:

### Available Subscriptions

1. **Project Updates**: `subscribeToProject(projectId, callback)`
2. **Project Tasks**: `subscribeToProjectTasks(projectId, callback)`
3. **Task Updates**: `subscribeToTask(taskId, callback)`
4. **Team Events**: `subscribeToTeamEvents(teamId, callback)`
5. **User Notifications**: `subscribeToUserNotifications(userId, callback)`
6. **Comments**: `subscribeToComments(entityType, entityId, callback)`

### Example Usage

```typescript
import { subscribeToProject, unsubscribe } from '@/lib/realtime';

const channel = subscribeToProject('project-uuid', (payload) => {
  console.log('Project updated:', payload);
});

// Later, to unsubscribe
unsubscribe(channel);
```

---

## Error Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error or malformed request)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate resource)
- **422**: Validation Error
- **500**: Internal Server Error

---

## Data Models

### User Roles
- `admin`: Full system access
- `manager`: Can manage teams and projects
- `member`: Can work on assigned tasks
- `viewer`: Read-only access

### Team Roles
- `owner`: Full team control
- `admin`: Can manage team members and projects
- `member`: Can participate in projects
- `viewer`: Read-only team access

### Project Status
- `planning`: Project is being planned
- `active`: Project is in progress
- `on_hold`: Project is paused
- `completed`: Project is finished
- `archived`: Project is archived

### Task Status
- `todo`: Task not started
- `in_progress`: Task is being worked on
- `review`: Task is under review
- `done`: Task is completed

### Priority Levels
- `low`: Low priority
- `medium`: Medium priority
- `high`: High priority
- `urgent`: Urgent priority

### Event Types
- `meeting`: Team or project meeting
- `deadline`: Important deadline
- `milestone`: Project milestone
- `reminder`: General reminder
