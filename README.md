# Task Management REST API

A simple yet robust Task Management REST API built with TypeScript and Express, featuring in-memory storage and comprehensive input validation.

## Features

- **RESTful API** with 5 task endpoints
- **In-memory storage** for tasks
- **Input validation** with detailed error responses
- **TypeScript** for type safety
- **Health check endpoint** for monitoring

## Task Model

Each task has the following properties:

```typescript
{
  id: string;           // UUID v4
  title: string;        // Required
  description?: string; // Optional
  status: 'todo' | 'in_progress' | 'done'; // Default: 'todo'
  createdAt: string;    // ISO 8601 timestamp
}
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-api
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

### Production Mode

1. Build the project:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

## API Endpoints

All task endpoints are prefixed with `/api`.

### Health Check

**GET** `/api/health`

Returns the health status of the API.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-03-08T12:00:00.000Z"
}
```

### Get All Tasks

**GET** `/api/tasks`

Returns all tasks.

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project",
    "description": "Finish the task management API",
    "status": "in_progress",
    "createdAt": "2026-03-08T10:30:00.000Z"
  }
]
```

### Create a Task

**POST** `/api/tasks`

Creates a new task.

**Request Body:**
```json
{
  "title": "New task",
  "description": "Task description (optional)",
  "status": "todo"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "New task",
  "description": "Task description (optional)",
  "status": "todo",
  "createdAt": "2026-03-08T10:30:00.000Z"
}
```

**Validation Errors (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### Get a Task by ID

**GET** `/api/tasks/:id`

Returns a single task by ID.

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project",
  "description": "Finish the task management API",
  "status": "in_progress",
  "createdAt": "2026-03-08T10:30:00.000Z"
}
```

**Not Found (404):**
```json
{
  "error": "Task not found",
  "message": "Task with id 550e8400-e29b-41d4-a716-446655440000 does not exist"
}
```

### Update a Task

**PATCH** `/api/tasks/:id`

Updates an existing task. All fields are optional.

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "done"
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated title",
  "description": "Updated description",
  "status": "done",
  "createdAt": "2026-03-08T10:30:00.000Z"
}
```

**Validation Errors (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "status",
      "message": "Status must be one of: todo, in_progress, done"
    }
  ]
}
```

**Not Found (404):**
```json
{
  "error": "Task not found",
  "message": "Task with id 550e8400-e29b-41d4-a716-446655440000 does not exist"
}
```

### Delete a Task

**DELETE** `/api/tasks/:id`

Deletes a task by ID.

**Response (204 No Content)**

**Not Found (404):**
```json
{
  "error": "Task not found",
  "message": "Task with id 550e8400-e29b-41d4-a716-446655440000 does not exist"
}
```

## Usage Examples

### Using cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My first task","status":"todo"}'

# Get all tasks
curl http://localhost:3000/api/tasks

# Get a specific task
curl http://localhost:3000/api/tasks/{task-id}

# Update a task
curl -X PATCH http://localhost:3000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'

# Delete a task
curl -X DELETE http://localhost:3000/api/tasks/{task-id}
```

## Project Structure

```
.
├── src/
│   ├── index.ts         # Application entry point
│   ├── routes.ts        # API routes and handlers
│   ├── taskStore.ts     # In-memory task storage
│   ├── types.ts         # TypeScript type definitions
│   └── validation.ts    # Input validation functions
├── dist/                # Compiled JavaScript (generated)
├── node_modules/        # Dependencies (generated)
├── .eslintrc.json       # ESLint configuration
├── .gitignore           # Git ignore rules
├── package.json         # Project metadata and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## Development

### Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm run lint` - Run ESLint to check code quality

### Code Quality

The project uses:
- **TypeScript** with strict mode enabled
- **ESLint** for code linting
- **Express** for the web framework

## Environment Variables

- `PORT` - Server port (default: 3000)

Example `.env` file:
```
PORT=3000
```

## Limitations

- **In-memory storage**: All data is lost when the server restarts. For production use, integrate a database.
- **No authentication**: The API is open to all requests. Add authentication for production use.
- **No persistence**: Tasks are not saved to disk.

## Future Enhancements

- Add database integration (PostgreSQL, MongoDB, etc.)
- Implement authentication and authorization
- Add pagination for task list
- Add filtering and sorting capabilities
- Add task search functionality
- Implement automated tests

## License

ISC
