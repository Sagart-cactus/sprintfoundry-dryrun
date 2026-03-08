import { TaskStatus } from './types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCreateTask(body: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== 'object') {
    errors.push({ field: 'body', message: 'Request body must be an object' });
    return errors;
  }

  const data = body as Record<string, unknown>;

  if (!data.title) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (typeof data.title !== 'string') {
    errors.push({ field: 'title', message: 'Title must be a string' });
  } else if (data.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title cannot be empty' });
  }

  if (data.description !== undefined && typeof data.description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (data.status !== undefined) {
    const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'done'];
    if (!validStatuses.includes(data.status as TaskStatus)) {
      errors.push({
        field: 'status',
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }
  }

  return errors;
}

export function validateUpdateTask(body: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== 'object') {
    errors.push({ field: 'body', message: 'Request body must be an object' });
    return errors;
  }

  const data = body as Record<string, unknown>;

  if (data.title !== undefined) {
    if (typeof data.title !== 'string') {
      errors.push({ field: 'title', message: 'Title must be a string' });
    } else if (data.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    }
  }

  if (data.description !== undefined && typeof data.description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (data.status !== undefined) {
    const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'done'];
    if (!validStatuses.includes(data.status as TaskStatus)) {
      errors.push({
        field: 'status',
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }
  }

  return errors;
}
