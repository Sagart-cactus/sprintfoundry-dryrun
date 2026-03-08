# Task Management REST API

Node.js + TypeScript + Express API with in-memory task storage.

## Features

- `GET /health`
- `GET /tasks`
- `POST /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- UUID task IDs (`id`)
- ISO-8601 timestamps (`createdAt`)
- Status lifecycle: `todo -> in_progress -> done`
- Request validation and structured error responses
- Endpoint unit tests with Vitest + Supertest

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run in development mode:

```bash
npm run dev
```

The server starts on `http://localhost:3000` by default.

## Scripts

- `npm run dev` - start dev server with watch mode
- `npm run build` - compile TypeScript into `dist/`
- `npm run typecheck` - run TypeScript checks
- `npm test` - run unit tests
- `npm run test:coverage` - run unit tests with coverage reports (written to `artifacts/coverage/`)

## API Usage

### Health

```bash
curl http://localhost:3000/health
```

### Create task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write docs","description":"README examples"}'
```

### List tasks

```bash
curl http://localhost:3000/tasks
```

### Get task by ID

```bash
curl http://localhost:3000/tasks/<task-id>
```

### Update task

```bash
curl -X PATCH http://localhost:3000/tasks/<task-id> \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

### Delete task

```bash
curl -X DELETE http://localhost:3000/tasks/<task-id>
```

## Data Model

```json
{
  "id": "uuid-v4",
  "title": "string",
  "description": "string",
  "status": "todo | in_progress | done",
  "createdAt": "ISO-8601 timestamp"
}
```

## Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'title' is required",
    "details": null
  }
}
```

## QA Artifacts

- OpenAPI contract: `artifacts/api-contracts.yaml`
- Product spec: `artifacts/product-spec.md`
- User stories: `artifacts/user-stories.md`
- Coverage output directory: `artifacts/coverage/`
