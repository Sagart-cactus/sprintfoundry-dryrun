"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = require("../src/app");
(0, vitest_1.describe)("Task Management API", () => {
    (0, vitest_1.it)("returns health status", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).get("/health");
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body).toEqual({ status: "ok" });
    });
    (0, vitest_1.it)("creates and lists tasks", async () => {
        const app = (0, app_1.createApp)();
        const createResponse = await (0, supertest_1.default)(app).post("/tasks").send({
            title: "Write tests",
            description: "Cover all routes"
        });
        (0, vitest_1.expect)(createResponse.status).toBe(201);
        (0, vitest_1.expect)(createResponse.body.task.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        (0, vitest_1.expect)(new Date(createResponse.body.task.createdAt).toISOString()).toBe(createResponse.body.task.createdAt);
        (0, vitest_1.expect)(createResponse.body.task.status).toBe("todo");
        const listResponse = await (0, supertest_1.default)(app).get("/tasks");
        (0, vitest_1.expect)(listResponse.status).toBe(200);
        (0, vitest_1.expect)(listResponse.body.tasks).toHaveLength(1);
        (0, vitest_1.expect)(listResponse.body.tasks[0].title).toBe("Write tests");
    });
    (0, vitest_1.it)("returns 400 for invalid create payload", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).post("/tasks").send({ title: "   " });
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.error.code).toBe("VALIDATION_ERROR");
    });
    (0, vitest_1.it)("returns 400 when create body is not an object", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).post("/tasks").send([]);
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.error.code).toBe("VALIDATION_ERROR");
    });
    (0, vitest_1.it)("gets task by id", async () => {
        const app = (0, app_1.createApp)();
        const created = await (0, supertest_1.default)(app).post("/tasks").send({ title: "Find me" });
        const response = await (0, supertest_1.default)(app).get(`/tasks/${created.body.task.id}`);
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.task.id).toBe(created.body.task.id);
    });
    (0, vitest_1.it)("returns 404 for missing task", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).get("/tasks/7f33286b-4a9f-4d0a-a7ff-2e4e056f44ca");
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body.error.code).toBe("NOT_FOUND");
    });
    (0, vitest_1.it)("updates title and status through valid lifecycle transition", async () => {
        const app = (0, app_1.createApp)();
        const created = await (0, supertest_1.default)(app).post("/tasks").send({ title: "Implement patch" });
        const response = await (0, supertest_1.default)(app).patch(`/tasks/${created.body.task.id}`).send({
            title: "Implement patch endpoint",
            status: "in_progress"
        });
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.task.title).toBe("Implement patch endpoint");
        (0, vitest_1.expect)(response.body.task.status).toBe("in_progress");
    });
    (0, vitest_1.it)("rejects invalid status transitions", async () => {
        const app = (0, app_1.createApp)();
        const created = await (0, supertest_1.default)(app).post("/tasks").send({ title: "No skipping" });
        const response = await (0, supertest_1.default)(app).patch(`/tasks/${created.body.task.id}`).send({
            status: "done"
        });
        (0, vitest_1.expect)(response.status).toBe(409);
        (0, vitest_1.expect)(response.body.error.code).toBe("INVALID_STATUS_TRANSITION");
    });
    (0, vitest_1.it)("rejects invalid status values", async () => {
        const app = (0, app_1.createApp)();
        const created = await (0, supertest_1.default)(app).post("/tasks").send({ title: "Validate status" });
        const response = await (0, supertest_1.default)(app).patch(`/tasks/${created.body.task.id}`).send({
            status: "blocked"
        });
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.error.code).toBe("VALIDATION_ERROR");
    });
    (0, vitest_1.it)("rejects invalid patch payload", async () => {
        const app = (0, app_1.createApp)();
        const created = await (0, supertest_1.default)(app).post("/tasks").send({ title: "Patch me" });
        const response = await (0, supertest_1.default)(app).patch(`/tasks/${created.body.task.id}`).send({});
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.error.code).toBe("VALIDATION_ERROR");
    });
    (0, vitest_1.it)("returns 404 for updating a missing task", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).patch("/tasks/7f33286b-4a9f-4d0a-a7ff-2e4e056f44ca").send({
            title: "Should fail"
        });
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body.error.code).toBe("NOT_FOUND");
    });
    (0, vitest_1.it)("deletes a task", async () => {
        const app = (0, app_1.createApp)();
        const created = await (0, supertest_1.default)(app).post("/tasks").send({ title: "Delete me" });
        const deleteResponse = await (0, supertest_1.default)(app).delete(`/tasks/${created.body.task.id}`);
        (0, vitest_1.expect)(deleteResponse.status).toBe(204);
        const getResponse = await (0, supertest_1.default)(app).get(`/tasks/${created.body.task.id}`);
        (0, vitest_1.expect)(getResponse.status).toBe(404);
    });
    (0, vitest_1.it)("returns 404 when deleting a missing task", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).delete("/tasks/7f33286b-4a9f-4d0a-a7ff-2e4e056f44ca");
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body.error.code).toBe("NOT_FOUND");
    });
    (0, vitest_1.it)("returns 400 for non-uuid task id", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).get("/tasks/not-a-uuid");
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.error.code).toBe("VALIDATION_ERROR");
    });
    (0, vitest_1.it)("returns 404 for unknown endpoint", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).get("/unknown");
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body.error.code).toBe("NOT_FOUND");
    });
});
