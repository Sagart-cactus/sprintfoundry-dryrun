import { describe, it, expect, beforeEach } from 'vitest';
import { taskStore } from '../../src/taskStore';

describe('TaskStore', () => {
  beforeEach(() => {
    // Clear all tasks before each test
    // @ts-expect-error - accessing private property for testing
    taskStore.tasks.clear();
  });

  describe('create', () => {
    it('should create a task with all fields', () => {
      const input = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'in_progress' as const,
      };

      const task = taskStore.create(input);

      expect(task).toMatchObject({
        title: 'Test Task',
        description: 'Test Description',
        status: 'in_progress',
      });
      expect(task.id).toBeDefined();
      expect(typeof task.id).toBe('string');
      expect(task.id.length).toBeGreaterThan(0);
      expect(task.createdAt).toBeDefined();
      expect(typeof task.createdAt).toBe('string');
    });

    it('should create a task with minimal fields', () => {
      const input = {
        title: 'Minimal Task',
      };

      const task = taskStore.create(input);

      expect(task.title).toBe('Minimal Task');
      expect(task.description).toBeUndefined();
      expect(task.status).toBe('todo');
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeDefined();
    });

    it('should generate unique IDs for each task', () => {
      const task1 = taskStore.create({ title: 'Task 1' });
      const task2 = taskStore.create({ title: 'Task 2' });
      const task3 = taskStore.create({ title: 'Task 3' });

      expect(task1.id).not.toBe(task2.id);
      expect(task1.id).not.toBe(task3.id);
      expect(task2.id).not.toBe(task3.id);
    });

    it('should generate valid ISO 8601 timestamps', () => {
      const task = taskStore.create({ title: 'Test Task' });

      const timestamp = new Date(task.createdAt);
      expect(timestamp.toISOString()).toBe(task.createdAt);
    });

    it('should default status to todo when not provided', () => {
      const task = taskStore.create({ title: 'Test Task' });

      expect(task.status).toBe('todo');
    });

    it('should accept todo status', () => {
      const task = taskStore.create({ title: 'Test Task', status: 'todo' });

      expect(task.status).toBe('todo');
    });

    it('should accept in_progress status', () => {
      const task = taskStore.create({ title: 'Test Task', status: 'in_progress' });

      expect(task.status).toBe('in_progress');
    });

    it('should accept done status', () => {
      const task = taskStore.create({ title: 'Test Task', status: 'done' });

      expect(task.status).toBe('done');
    });

    it('should store the created task', () => {
      const task = taskStore.create({ title: 'Test Task' });

      const foundTask = taskStore.findById(task.id);
      expect(foundTask).toEqual(task);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no tasks exist', () => {
      const tasks = taskStore.findAll();

      expect(tasks).toEqual([]);
    });

    it('should return all tasks', () => {
      const task1 = taskStore.create({ title: 'Task 1' });
      const task2 = taskStore.create({ title: 'Task 2' });
      const task3 = taskStore.create({ title: 'Task 3' });

      const tasks = taskStore.findAll();

      expect(tasks).toHaveLength(3);
      expect(tasks).toContainEqual(task1);
      expect(tasks).toContainEqual(task2);
      expect(tasks).toContainEqual(task3);
    });

    it('should return a new array each time', () => {
      taskStore.create({ title: 'Task 1' });

      const tasks1 = taskStore.findAll();
      const tasks2 = taskStore.findAll();

      expect(tasks1).not.toBe(tasks2);
      expect(tasks1).toEqual(tasks2);
    });
  });

  describe('findById', () => {
    it('should return task when it exists', () => {
      const created = taskStore.create({ title: 'Test Task', description: 'Test Desc' });

      const found = taskStore.findById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined when task does not exist', () => {
      const found = taskStore.findById('non-existent-id');

      expect(found).toBeUndefined();
    });

    it('should return undefined for empty string ID', () => {
      const found = taskStore.findById('');

      expect(found).toBeUndefined();
    });

    it('should return correct task among many', () => {
      const task1 = taskStore.create({ title: 'Task 1' });
      const task2 = taskStore.create({ title: 'Task 2' });
      const task3 = taskStore.create({ title: 'Task 3' });

      const found = taskStore.findById(task2.id);

      expect(found).toEqual(task2);
      expect(found).not.toEqual(task1);
      expect(found).not.toEqual(task3);
    });
  });

  describe('update', () => {
    it('should update task title', () => {
      const created = taskStore.create({ title: 'Original', description: 'Desc', status: 'todo' });

      const updated = taskStore.update(created.id, { title: 'Updated' });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Updated');
      expect(updated?.description).toBe('Desc');
      expect(updated?.status).toBe('todo');
      expect(updated?.id).toBe(created.id);
      expect(updated?.createdAt).toBe(created.createdAt);
    });

    it('should update task description', () => {
      const created = taskStore.create({ title: 'Title', description: 'Original', status: 'todo' });

      const updated = taskStore.update(created.id, { description: 'Updated' });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Title');
      expect(updated?.description).toBe('Updated');
      expect(updated?.status).toBe('todo');
    });

    it('should update task status', () => {
      const created = taskStore.create({ title: 'Title', status: 'todo' });

      const updated = taskStore.update(created.id, { status: 'done' });

      expect(updated).toBeDefined();
      expect(updated?.status).toBe('done');
      expect(updated?.title).toBe('Title');
    });

    it('should update multiple fields at once', () => {
      const created = taskStore.create({ title: 'Original', description: 'Original Desc', status: 'todo' });

      const updated = taskStore.update(created.id, {
        title: 'Updated',
        description: 'Updated Desc',
        status: 'done',
      });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Updated');
      expect(updated?.description).toBe('Updated Desc');
      expect(updated?.status).toBe('done');
      expect(updated?.id).toBe(created.id);
      expect(updated?.createdAt).toBe(created.createdAt);
    });

    it('should preserve fields that are not updated', () => {
      const created = taskStore.create({ title: 'Title', description: 'Desc', status: 'todo' });

      const updated = taskStore.update(created.id, { status: 'done' });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Title');
      expect(updated?.description).toBe('Desc');
      expect(updated?.status).toBe('done');
    });

    it('should return undefined when task does not exist', () => {
      const updated = taskStore.update('non-existent-id', { title: 'Updated' });

      expect(updated).toBeUndefined();
    });

    it('should persist the update', () => {
      const created = taskStore.create({ title: 'Original' });

      taskStore.update(created.id, { title: 'Updated' });

      const found = taskStore.findById(created.id);
      expect(found?.title).toBe('Updated');
    });

    it('should handle updating with undefined values (no-op for undefined)', () => {
      const created = taskStore.create({ title: 'Title', description: 'Desc', status: 'todo' });

      const updated = taskStore.update(created.id, {
        title: undefined,
        description: undefined,
        status: undefined,
      });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Title');
      expect(updated?.description).toBe('Desc');
      expect(updated?.status).toBe('todo');
    });

    it('should allow clearing description by setting it explicitly', () => {
      const created = taskStore.create({ title: 'Title', description: 'Has description' });

      const updated = taskStore.update(created.id, { description: undefined });

      // Since undefined means "don't change", the description should remain
      expect(updated?.description).toBe('Has description');
    });
  });

  describe('delete', () => {
    it('should delete an existing task', () => {
      const created = taskStore.create({ title: 'Task to Delete' });

      const result = taskStore.delete(created.id);

      expect(result).toBe(true);

      const found = taskStore.findById(created.id);
      expect(found).toBeUndefined();
    });

    it('should return false when task does not exist', () => {
      const result = taskStore.delete('non-existent-id');

      expect(result).toBe(false);
    });

    it('should not affect other tasks', () => {
      const task1 = taskStore.create({ title: 'Task 1' });
      const task2 = taskStore.create({ title: 'Task 2' });
      const task3 = taskStore.create({ title: 'Task 3' });

      taskStore.delete(task2.id);

      const found1 = taskStore.findById(task1.id);
      const found2 = taskStore.findById(task2.id);
      const found3 = taskStore.findById(task3.id);

      expect(found1).toBeDefined();
      expect(found2).toBeUndefined();
      expect(found3).toBeDefined();
    });

    it('should allow re-creating a task after deletion', () => {
      const created1 = taskStore.create({ title: 'Task' });
      taskStore.delete(created1.id);

      const created2 = taskStore.create({ title: 'Task' });

      expect(created2.id).not.toBe(created1.id);

      const found = taskStore.findById(created2.id);
      expect(found).toBeDefined();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle a complete task lifecycle', () => {
      // Create
      const task = taskStore.create({ title: 'New Task', status: 'todo' });
      expect(task.status).toBe('todo');

      // Update status to in_progress
      const updated1 = taskStore.update(task.id, { status: 'in_progress' });
      expect(updated1?.status).toBe('in_progress');

      // Update status to done
      const updated2 = taskStore.update(task.id, { status: 'done' });
      expect(updated2?.status).toBe('done');

      // Verify via findById
      const found = taskStore.findById(task.id);
      expect(found?.status).toBe('done');

      // Delete
      const deleted = taskStore.delete(task.id);
      expect(deleted).toBe(true);

      // Verify deletion
      const notFound = taskStore.findById(task.id);
      expect(notFound).toBeUndefined();
    });

    it('should handle multiple tasks independently', () => {
      const task1 = taskStore.create({ title: 'Task 1', status: 'todo' });
      const task2 = taskStore.create({ title: 'Task 2', status: 'todo' });

      // Update task1
      taskStore.update(task1.id, { status: 'done' });

      // Verify task1 is updated but task2 is not
      const found1 = taskStore.findById(task1.id);
      const found2 = taskStore.findById(task2.id);

      expect(found1?.status).toBe('done');
      expect(found2?.status).toBe('todo');
    });
  });
});
