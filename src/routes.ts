import { Router, Request, Response } from 'express';
import { taskStore } from './taskStore';
import { validateCreateTask, validateUpdateTask } from './validation';
import { CreateTaskInput, UpdateTaskInput } from './types';

export const router = Router();

// GET /tasks - Get all tasks
router.get('/tasks', (_req: Request, res: Response) => {
  const tasks = taskStore.findAll();
  res.json(tasks);
});

// POST /tasks - Create a new task
router.post('/tasks', (req: Request, res: Response) => {
  const errors = validateCreateTask(req.body);

  if (errors.length > 0) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
    return;
  }

  const input: CreateTaskInput = {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
  };

  const task = taskStore.create(input);
  res.status(201).json(task);
});

// GET /tasks/:id - Get a single task by ID
router.get('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const task = taskStore.findById(id);

  if (!task) {
    res.status(404).json({
      error: 'Task not found',
      message: `Task with id ${id} does not exist`,
    });
    return;
  }

  res.json(task);
});

// PATCH /tasks/:id - Update a task
router.patch('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const task = taskStore.findById(id);
  if (!task) {
    res.status(404).json({
      error: 'Task not found',
      message: `Task with id ${id} does not exist`,
    });
    return;
  }

  const errors = validateUpdateTask(req.body);
  if (errors.length > 0) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
    return;
  }

  const input: UpdateTaskInput = {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
  };

  const updatedTask = taskStore.update(id, input);
  res.json(updatedTask);
});

// DELETE /tasks/:id - Delete a task
router.delete('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const task = taskStore.findById(id);
  if (!task) {
    res.status(404).json({
      error: 'Task not found',
      message: `Task with id ${id} does not exist`,
    });
    return;
  }

  taskStore.delete(id);
  res.status(204).send();
});

// GET /health - Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});
