import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { router } from '../../src/routes';
import { taskStore } from '../../src/taskStore';

// Create a test app
const app = express();
app.use(express.json());
app.use('/api', router);

describe('Task Management API', () => {
  // Clear tasks before each test
  beforeEach(() => {
    // @ts-expect-error - accessing private property for testing
    taskStore.tasks.clear();
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(typeof response.body.timestamp).toBe('string');
    });

    it('should return valid ISO 8601 timestamp', async () => {
      const response = await request(app).get('/api/health');

      const timestamp = response.body.timestamp;
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a task with all fields', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
      expect(typeof response.body.id).toBe('string');
      expect(response.body.id.length).toBeGreaterThan(0);
    });

    it('should create a task with only required fields', async () => {
      const taskData = {
        title: 'Minimal Task',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Minimal Task');
      expect(response.body.status).toBe('todo');
      expect(response.body.description).toBeUndefined();
    });

    it('should create a task with in_progress status', async () => {
      const taskData = {
        title: 'In Progress Task',
        status: 'in_progress',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('in_progress');
    });

    it('should create a task with done status', async () => {
      const taskData = {
        title: 'Done Task',
        status: 'done',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('done');
    });

    it('should fail when title is missing', async () => {
      const taskData = {
        description: 'No title provided',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: 'Title is required',
          }),
        ])
      );
    });

    it('should fail when title is empty string', async () => {
      const taskData = {
        title: '',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: 'Title cannot be empty',
          }),
        ])
      );
    });

    it('should fail when title is only whitespace', async () => {
      const taskData = {
        title: '   ',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: 'Title cannot be empty',
          }),
        ])
      );
    });

    it('should fail when title is not a string', async () => {
      const taskData = {
        title: 123,
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: 'Title must be a string',
          }),
        ])
      );
    });

    it('should fail when status is invalid', async () => {
      const taskData = {
        title: 'Test Task',
        status: 'invalid_status',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'status',
            message: 'Status must be one of: todo, in_progress, done',
          }),
        ])
      );
    });

    it('should fail when description is not a string', async () => {
      const taskData = {
        title: 'Test Task',
        description: 123,
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'description',
            message: 'Description must be a string',
          }),
        ])
      );
    });

    it('should handle special characters in title and description', async () => {
      const taskData = {
        title: 'Task with special chars: !@#$%^&*()',
        description: 'Description with emoji 🚀 and unicode: café',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(taskData.title);
      expect(response.body.description).toBe(taskData.description);
    });
  });

  describe('GET /api/tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all tasks', async () => {
      // Create some tasks
      await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 1' });
      await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 2', description: 'Description 2' });
      await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 3', status: 'done' });

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].title).toBe('Task 1');
      expect(response.body[1].title).toBe('Task 2');
      expect(response.body[2].title).toBe('Task 3');
      expect(response.body[2].status).toBe('done');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by id', async () => {
      // Create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test Task', description: 'Test Description' });

      const taskId = createResponse.body.id;

      // Get the task
      const response = await request(app).get(`/api/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
      });
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = 'non-existent-id';
      const response = await request(app).get(`/api/tasks/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
      expect(response.body.message).toContain(fakeId);
    });

    it('should return 404 for UUID that does not exist', async () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      const response = await request(app).get(`/api/tasks/${validUuid}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should update task title', async () => {
      // Create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original Title' });

      const taskId = createResponse.body.id;

      // Update the task
      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ title: 'Updated Title' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.id).toBe(taskId);
    });

    it('should update task description', async () => {
      // Create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test Task' });

      const taskId = createResponse.body.id;

      // Update the task
      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ description: 'New Description' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.description).toBe('New Description');
    });

    it('should update task status', async () => {
      // Create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test Task' });

      const taskId = createResponse.body.id;

      // Update status to in_progress
      let response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ status: 'in_progress' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('in_progress');

      // Update status to done
      response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ status: 'done' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('done');
    });

    it('should update multiple fields at once', async () => {
      // Create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original', description: 'Original Desc' });

      const taskId = createResponse.body.id;

      // Update multiple fields
      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({
          title: 'Updated',
          description: 'Updated Desc',
          status: 'done',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated');
      expect(response.body.description).toBe('Updated Desc');
      expect(response.body.status).toBe('done');
    });

    it('should preserve unchanged fields', async () => {
      // Create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original', description: 'Original Desc', status: 'todo' });

      const taskId = createResponse.body.id;
      const createdAt = createResponse.body.createdAt;

      // Update only status
      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ status: 'done' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Original');
      expect(response.body.description).toBe('Original Desc');
      expect(response.body.status).toBe('done');
      expect(response.body.createdAt).toBe(createdAt);
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = 'non-existent-id';
      const response = await request(app)
        .patch(`/api/tasks/${fakeId}`)
        .send({ title: 'Updated' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should fail when title is empty string', async () => {
      // Create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original' });

      const taskId = createResponse.body.id;

      // Try to update with empty title
      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ title: '' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: 'Title cannot be empty',
          }),
        ])
      );
    });

    it('should fail when status is invalid', async () => {
      // Create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test' });

      const taskId = createResponse.body.id;

      // Try to update with invalid status
      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ status: 'invalid' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'status',
            message: 'Status must be one of: todo, in_progress, done',
          }),
        ])
      );
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      // Create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task to Delete' });

      const taskId = createResponse.body.id;

      // Delete the task
      const deleteResponse = await request(app).delete(`/api/tasks/${taskId}`);

      expect(deleteResponse.status).toBe(204);
      expect(deleteResponse.body).toEqual({});

      // Verify task is deleted
      const getResponse = await request(app).get(`/api/tasks/${taskId}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting non-existent task', async () => {
      const fakeId = 'non-existent-id';
      const response = await request(app).delete(`/api/tasks/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should not affect other tasks when deleting one', async () => {
      // Create multiple tasks
      const task1 = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 1' });
      const task2 = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 2' });
      const task3 = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 3' });

      // Delete task 2
      await request(app).delete(`/api/tasks/${task2.body.id}`);

      // Verify other tasks still exist
      const allTasksResponse = await request(app).get('/api/tasks');
      expect(allTasksResponse.body).toHaveLength(2);
      expect(allTasksResponse.body.map((t: { id: string }) => t.id)).toContain(task1.body.id);
      expect(allTasksResponse.body.map((t: { id: string }) => t.id)).toContain(task3.body.id);
      expect(allTasksResponse.body.map((t: { id: string }) => t.id)).not.toContain(task2.body.id);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long title', async () => {
      const longTitle = 'A'.repeat(1000);
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: longTitle })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(longTitle);
    });

    it('should handle very long description', async () => {
      const longDescription = 'B'.repeat(5000);
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', description: longDescription })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.description).toBe(longDescription);
    });

    it('should handle creating many tasks quickly', async () => {
      const promises = [];
      for (let i = 0; i < 50; i++) {
        promises.push(
          request(app)
            .post('/api/tasks')
            .send({ title: `Task ${i}` })
        );
      }

      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      const allTasksResponse = await request(app).get('/api/tasks');
      expect(allTasksResponse.body).toHaveLength(50);
    });
  });
});
