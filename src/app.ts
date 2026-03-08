import express, { NextFunction, Request, Response } from "express";
import { ApiError } from "./errors";
import { TaskStore } from "./store/taskStore";
import { parseCreateTaskInput, parseUpdateTaskInput, validateTaskId } from "./validation";

export function createApp(taskStore = new TaskStore()): express.Express {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/tasks", (_req: Request, res: Response) => {
    res.status(200).json({ tasks: taskStore.list() });
  });

  app.post("/tasks", (req: Request, res: Response) => {
    const input = parseCreateTaskInput(req.body);
    const task = taskStore.create(input.title, input.description ?? "");
    res.status(201).json({ task });
  });

  app.get("/tasks/:id", (req: Request, res: Response) => {
    const id = validateTaskId(req.params.id);
    const task = taskStore.getById(id);

    if (!task) {
      throw new ApiError(404, "NOT_FOUND", `Task with ID '${id}' was not found`);
    }

    res.status(200).json({ task });
  });

  app.patch("/tasks/:id", (req: Request, res: Response) => {
    const id = validateTaskId(req.params.id);
    const patch = parseUpdateTaskInput(req.body);

    try {
      const updatedTask = taskStore.updateById(id, patch);
      if (!updatedTask) {
        throw new ApiError(404, "NOT_FOUND", `Task with ID '${id}' was not found`);
      }

      res.status(200).json({ task: updatedTask });
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(409, "INVALID_STATUS_TRANSITION", (error as Error).message);
    }
  });

  app.delete("/tasks/:id", (req: Request, res: Response) => {
    const id = validateTaskId(req.params.id);
    const removed = taskStore.deleteById(id);

    if (!removed) {
      throw new ApiError(404, "NOT_FOUND", `Task with ID '${id}' was not found`);
    }

    res.status(204).send();
  });

  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new ApiError(404, "NOT_FOUND", "Endpoint not found"));
  });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      });
      return;
    }

    res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred"
      }
    });
  });

  return app;
}
