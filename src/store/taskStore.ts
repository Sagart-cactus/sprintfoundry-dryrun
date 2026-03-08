import { randomUUID } from "node:crypto";
import { Task, TaskStatus, UpdateTaskInput } from "../types/task";

const VALID_STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  todo: ["in_progress"],
  in_progress: ["done"],
  done: []
};

export class TaskStore {
  private readonly tasks = new Map<string, Task>();

  public list(): Task[] {
    return Array.from(this.tasks.values());
  }

  public create(title: string, description: string): Task {
    const task: Task = {
      id: randomUUID(),
      title,
      description,
      status: "todo",
      createdAt: new Date().toISOString()
    };

    this.tasks.set(task.id, task);
    return task;
  }

  public getById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  public deleteById(id: string): boolean {
    return this.tasks.delete(id);
  }

  public updateById(id: string, patch: UpdateTaskInput): Task | undefined {
    const existing = this.tasks.get(id);
    if (!existing) {
      return undefined;
    }

    if (patch.status && patch.status !== existing.status) {
      const allowedTransitions = VALID_STATUS_TRANSITIONS[existing.status];
      if (!allowedTransitions.includes(patch.status)) {
        throw new Error(`Invalid status transition from ${existing.status} to ${patch.status}`);
      }
    }

    const updated: Task = {
      ...existing,
      ...patch
    };

    this.tasks.set(id, updated);
    return updated;
  }

  public clear(): void {
    this.tasks.clear();
  }
}
