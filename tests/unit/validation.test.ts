import { describe, it, expect } from 'vitest';
import { validateCreateTask, validateUpdateTask } from '../../src/validation';

describe('Validation', () => {
  describe('validateCreateTask', () => {
    it('should pass validation for valid task with all fields', () => {
      const input = {
        title: 'Valid Task',
        description: 'Valid Description',
        status: 'todo',
      };

      const errors = validateCreateTask(input);
      expect(errors).toEqual([]);
    });

    it('should pass validation for valid task with only title', () => {
      const input = {
        title: 'Valid Task',
      };

      const errors = validateCreateTask(input);
      expect(errors).toEqual([]);
    });

    it('should pass validation for each valid status', () => {
      const statuses = ['todo', 'in_progress', 'done'];

      statuses.forEach((status) => {
        const input = {
          title: 'Valid Task',
          status,
        };

        const errors = validateCreateTask(input);
        expect(errors).toEqual([]);
      });
    });

    it('should fail when body is null', () => {
      const errors = validateCreateTask(null);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'body',
        message: 'Request body must be an object',
      });
    });

    it('should fail when body is undefined', () => {
      const errors = validateCreateTask(undefined);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'body',
        message: 'Request body must be an object',
      });
    });

    it('should fail when body is a string', () => {
      const errors = validateCreateTask('not an object');
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'body',
        message: 'Request body must be an object',
      });
    });

    it('should fail when title is missing', () => {
      const input = {
        description: 'No title',
      };

      const errors = validateCreateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'title',
        message: 'Title is required',
      });
    });

    it('should fail when title is null', () => {
      const input = {
        title: null,
      };

      const errors = validateCreateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'title',
        message: 'Title is required',
      });
    });

    it('should fail when title is empty string', () => {
      const input = {
        title: '',
      };

      const errors = validateCreateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'title',
        message: 'Title is required',
      });
    });

    it('should fail when title is whitespace only', () => {
      const input = {
        title: '   ',
      };

      const errors = validateCreateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'title',
        message: 'Title cannot be empty',
      });
    });

    it('should fail when title is not a string', () => {
      const input = {
        title: 123,
      };

      const errors = validateCreateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'title',
        message: 'Title must be a string',
      });
    });

    it('should fail when title is a boolean', () => {
      const input = {
        title: true,
      };

      const errors = validateCreateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'title',
        message: 'Title must be a string',
      });
    });

    it('should fail when title is an array', () => {
      const input = {
        title: ['array'],
      };

      const errors = validateCreateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'title',
        message: 'Title must be a string',
      });
    });

    it('should fail when description is not a string', () => {
      const input = {
        title: 'Valid Title',
        description: 123,
      };

      const errors = validateCreateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'description',
        message: 'Description must be a string',
      });
    });

    it('should fail when description is a boolean', () => {
      const input = {
        title: 'Valid Title',
        description: false,
      };

      const errors = validateCreateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'description',
        message: 'Description must be a string',
      });
    });

    it('should fail when status is invalid', () => {
      const input = {
        title: 'Valid Title',
        status: 'invalid_status',
      };

      const errors = validateCreateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'status',
        message: 'Status must be one of: todo, in_progress, done',
      });
    });

    it('should fail when status is a number', () => {
      const input = {
        title: 'Valid Title',
        status: 123,
      };

      const errors = validateCreateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'status',
        message: 'Status must be one of: todo, in_progress, done',
      });
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const input = {
        title: 123,
        description: true,
        status: 'invalid',
      };

      const errors = validateCreateTask(input);
      expect(errors).toHaveLength(3);
      expect(errors).toContainEqual({
        field: 'title',
        message: 'Title must be a string',
      });
      expect(errors).toContainEqual({
        field: 'description',
        message: 'Description must be a string',
      });
      expect(errors).toContainEqual({
        field: 'status',
        message: 'Status must be one of: todo, in_progress, done',
      });
    });

    it('should accept empty string for description', () => {
      const input = {
        title: 'Valid Title',
        description: '',
      };

      const errors = validateCreateTask(input);
      expect(errors).toEqual([]);
    });
  });

  describe('validateUpdateTask', () => {
    it('should pass validation for valid partial update', () => {
      const input = {
        title: 'Updated Title',
      };

      const errors = validateUpdateTask(input);
      expect(errors).toEqual([]);
    });

    it('should pass validation when updating only description', () => {
      const input = {
        description: 'Updated Description',
      };

      const errors = validateUpdateTask(input);
      expect(errors).toEqual([]);
    });

    it('should pass validation when updating only status', () => {
      const input = {
        status: 'done',
      };

      const errors = validateUpdateTask(input);
      expect(errors).toEqual([]);
    });

    it('should pass validation for all valid statuses', () => {
      const statuses = ['todo', 'in_progress', 'done'];

      statuses.forEach((status) => {
        const input = {
          status,
        };

        const errors = validateUpdateTask(input);
        expect(errors).toEqual([]);
      });
    });

    it('should pass validation for empty object', () => {
      const input = {};

      const errors = validateUpdateTask(input);
      expect(errors).toEqual([]);
    });

    it('should fail when body is null', () => {
      const errors = validateUpdateTask(null);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'body',
        message: 'Request body must be an object',
      });
    });

    it('should fail when body is undefined', () => {
      const errors = validateUpdateTask(undefined);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'body',
        message: 'Request body must be an object',
      });
    });

    it('should fail when title is empty string', () => {
      const input = {
        title: '',
      };

      const errors = validateUpdateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'title',
        message: 'Title cannot be empty',
      });
    });

    it('should fail when title is whitespace only', () => {
      const input = {
        title: '   ',
      };

      const errors = validateUpdateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'title',
        message: 'Title cannot be empty',
      });
    });

    it('should fail when title is not a string', () => {
      const input = {
        title: 123,
      };

      const errors = validateUpdateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'title',
        message: 'Title must be a string',
      });
    });

    it('should fail when description is not a string', () => {
      const input = {
        description: 123,
      };

      const errors = validateUpdateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'description',
        message: 'Description must be a string',
      });
    });

    it('should fail when status is invalid', () => {
      const input = {
        status: 'invalid_status',
      };

      const errors = validateUpdateTask(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'status',
        message: 'Status must be one of: todo, in_progress, done',
      });
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const input = {
        title: 123,
        description: true,
        status: 'invalid',
      };

      const errors = validateUpdateTask(input);
      expect(errors).toHaveLength(3);
      expect(errors).toContainEqual({
        field: 'title',
        message: 'Title must be a string',
      });
      expect(errors).toContainEqual({
        field: 'description',
        message: 'Description must be a string',
      });
      expect(errors).toContainEqual({
        field: 'status',
        message: 'Status must be one of: todo, in_progress, done',
      });
    });

    it('should accept empty string for description', () => {
      const input = {
        description: '',
      };

      const errors = validateUpdateTask(input);
      expect(errors).toEqual([]);
    });

    it('should pass validation for all fields updated at once', () => {
      const input = {
        title: 'New Title',
        description: 'New Description',
        status: 'done',
      };

      const errors = validateUpdateTask(input);
      expect(errors).toEqual([]);
    });
  });
});
