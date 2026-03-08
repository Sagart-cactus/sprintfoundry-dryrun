"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaskId = validateTaskId;
exports.parseCreateTaskInput = parseCreateTaskInput;
exports.parseUpdateTaskInput = parseUpdateTaskInput;
const errors_1 = require("./errors");
const task_1 = require("./types/task");
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function validateStringField(value, fieldName, { required, maxLength }) {
    if (value === undefined) {
        if (required) {
            throw new errors_1.ApiError(400, "VALIDATION_ERROR", `Field '${fieldName}' is required`);
        }
        return undefined;
    }
    if (typeof value !== "string") {
        throw new errors_1.ApiError(400, "VALIDATION_ERROR", `Field '${fieldName}' must be a string`);
    }
    const trimmed = value.trim();
    if (!trimmed) {
        throw new errors_1.ApiError(400, "VALIDATION_ERROR", `Field '${fieldName}' cannot be empty`);
    }
    if (trimmed.length > maxLength) {
        throw new errors_1.ApiError(400, "VALIDATION_ERROR", `Field '${fieldName}' must be at most ${maxLength} characters long`);
    }
    return trimmed;
}
function validateTaskId(id) {
    if (!UUID_V4_REGEX.test(id)) {
        throw new errors_1.ApiError(400, "VALIDATION_ERROR", "Task ID must be a valid UUID");
    }
    return id;
}
function parseCreateTaskInput(body) {
    if (!isObject(body)) {
        throw new errors_1.ApiError(400, "VALIDATION_ERROR", "Request body must be a JSON object");
    }
    const title = validateStringField(body.title, "title", { required: true, maxLength: MAX_TITLE_LENGTH });
    const description = validateStringField(body.description, "description", {
        required: false,
        maxLength: MAX_DESCRIPTION_LENGTH
    });
    if (!title) {
        throw new errors_1.ApiError(400, "VALIDATION_ERROR", "Field 'title' is required");
    }
    return {
        title,
        description
    };
}
function parseUpdateTaskInput(body) {
    if (!isObject(body)) {
        throw new errors_1.ApiError(400, "VALIDATION_ERROR", "Request body must be a JSON object");
    }
    const patch = {};
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
        if (typeof body.status !== "string" || !task_1.TASK_STATUSES.includes(body.status)) {
            throw new errors_1.ApiError(400, "VALIDATION_ERROR", "Field 'status' must be one of: todo, in_progress, done");
        }
        patch.status = body.status;
    }
    if (Object.keys(patch).length === 0) {
        throw new errors_1.ApiError(400, "VALIDATION_ERROR", "At least one updatable field must be provided");
    }
    return patch;
}
