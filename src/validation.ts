import { ApiError } from "./errors";
import { TASK_STATUSES, CreateTaskInput, TaskStatus, UpdateTaskInput } from "./types/task";

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;

type UnknownRecord = Record<string, unknown>;
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateStringField(
  value: unknown,
  fieldName: string,
  { required, maxLength }: { required: boolean; maxLength: number }
): string | undefined {
  if (value === undefined) {
    if (required) {
      throw new ApiError(400, "VALIDATION_ERROR", `Field '${fieldName}' is required`);
    }
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ApiError(400, "VALIDATION_ERROR", `Field '${fieldName}' must be a string`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new ApiError(400, "VALIDATION_ERROR", `Field '${fieldName}' cannot be empty`);
  }

  if (trimmed.length > maxLength) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      `Field '${fieldName}' must be at most ${maxLength} characters long`
    );
  }

  return trimmed;
}

export function validateTaskId(id: string): string {
  if (!UUID_V4_REGEX.test(id)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Task ID must be a valid UUID");
  }

  return id;
}

export function parseCreateTaskInput(body: unknown): CreateTaskInput {
  if (!isObject(body)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Request body must be a JSON object");
  }

  const title = validateStringField(body.title, "title", { required: true, maxLength: MAX_TITLE_LENGTH });
  const description = validateStringField(body.description, "description", {
    required: false,
    maxLength: MAX_DESCRIPTION_LENGTH
  });

  if (!title) {
    throw new ApiError(400, "VALIDATION_ERROR", "Field 'title' is required");
  }

  return {
    title,
    description
  };
}

export function parseUpdateTaskInput(body: unknown): UpdateTaskInput {
  if (!isObject(body)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Request body must be a JSON object");
  }

  const patch: UpdateTaskInput = {};

  if (body.title !== undefined) {
    patch.title = validateStringField(body.title, "title", { required: false, maxLength: MAX_TITLE_LENGTH });
  }

  if (body.description !== undefined) {
    patch.description = validateStringField(body.description, "description", {
      required: false,
      maxLength: MAX_DESCRIPTION_LENGTH
    });
  }

  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !TASK_STATUSES.includes(body.status as TaskStatus)) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        "Field 'status' must be one of: todo, in_progress, done"
      );
    }
    patch.status = body.status as TaskStatus;
  }

  if (Object.keys(patch).length === 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "At least one updatable field must be provided");
  }

  return patch;
}
