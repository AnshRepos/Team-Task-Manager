# Authentication API

Base URL:

```text
http://localhost:5000/api/v1/auth
```

## Signup

```http
POST /signup
Content-Type: application/json

{
  "name": "Ansh Narang",
  "email": "ansh@example.com",
  "password": "Password123"
}
```

Success response:

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "name": "Ansh Narang",
      "email": "ansh@example.com",
      "role": "member",
      "createdAt": "2026-05-20T10:00:00.000Z",
      "updatedAt": "2026-05-20T10:00:00.000Z",
      "id": "665f0f000000000000000000"
    },
    "token": "jwt-access-token"
  }
}
```

Duplicate account response:

```json
{
  "success": false,
  "error": {
    "message": "An account with this email already exists"
  }
}
```

## Login

```http
POST /login
Content-Type: application/json

{
  "email": "ansh@example.com",
  "password": "Password123"
}
```

Success response:

```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "name": "Ansh Narang",
      "email": "ansh@example.com",
      "role": "member",
      "createdAt": "2026-05-20T10:00:00.000Z",
      "updatedAt": "2026-05-20T10:00:00.000Z",
      "id": "665f0f000000000000000000"
    },
    "token": "jwt-access-token"
  }
}
```

Invalid credentials response:

```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password"
  }
}
```

## Get Current User

```http
GET /me
Authorization: Bearer jwt-access-token
```

Success response:

```json
{
  "success": true,
  "message": "Current user fetched successfully",
  "data": {
    "user": {
      "name": "Ansh Narang",
      "email": "ansh@example.com",
      "role": "member",
      "createdAt": "2026-05-20T10:00:00.000Z",
      "updatedAt": "2026-05-20T10:00:00.000Z",
      "id": "665f0f000000000000000000"
    }
  }
}
```

Missing or invalid token response:

```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired authentication token"
  }
}
```

## Logout

JWT logout is handled on the frontend by removing the stored token. This endpoint confirms the logout action for client flows.

```http
POST /logout
Authorization: Bearer jwt-access-token
```

Success response:

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": {
    "instruction": "Remove the access token from frontend storage."
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
        "path": "body.password",
        "message": "Password must be at least 8 characters long"
      }
    ]
  }
}
```
