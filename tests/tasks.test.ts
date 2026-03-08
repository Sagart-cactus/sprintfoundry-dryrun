import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

describe("Task Management API", () => {
  it("returns health status", async () => {
    const app = createApp();

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("creates and lists tasks", async () => {
    const app = createApp();

    const createResponse = await request(app).post("/tasks").send({
      title: "Write tests",
      description: "Cover all routes"
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.task.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(new Date(createResponse.body.task.createdAt).toISOString()).toBe(createResponse.body.task.createdAt);
    expect(createResponse.body.task.status).toBe("todo");

    const listResponse = await request(app).get("/tasks");

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.tasks).toHaveLength(1);
    expect(listResponse.body.tasks[0].title).toBe("Write tests");
  });

  it("returns 400 for invalid create payload", async () => {
    const app = createApp();

    const response = await request(app).post("/tasks").send({ title: "   " });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("gets task by id", async () => {
    const app = createApp();
    const created = await request(app).post("/tasks").send({ title: "Find me" });

    const response = await request(app).get(`/tasks/${created.body.task.id}`);

    expect(response.status).toBe(200);
    expect(response.body.task.id).toBe(created.body.task.id);
  });

  it("returns 404 for missing task", async () => {
    const app = createApp();

    const response = await request(app).get("/tasks/7f33286b-4a9f-4d0a-a7ff-2e4e056f44ca");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  it("updates title and status through valid lifecycle transition", async () => {
    const app = createApp();
    const created = await request(app).post("/tasks").send({ title: "Implement patch" });

    const response = await request(app).patch(`/tasks/${created.body.task.id}`).send({
      title: "Implement patch endpoint",
      status: "in_progress"
    });

    expect(response.status).toBe(200);
    expect(response.body.task.title).toBe("Implement patch endpoint");
    expect(response.body.task.status).toBe("in_progress");
  });

  it("rejects invalid status transitions", async () => {
    const app = createApp();
    const created = await request(app).post("/tasks").send({ title: "No skipping" });

    const response = await request(app).patch(`/tasks/${created.body.task.id}`).send({
      status: "done"
    });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("INVALID_STATUS_TRANSITION");
  });

  it("rejects invalid patch payload", async () => {
    const app = createApp();
    const created = await request(app).post("/tasks").send({ title: "Patch me" });

    const response = await request(app).patch(`/tasks/${created.body.task.id}`).send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("deletes a task", async () => {
    const app = createApp();
    const created = await request(app).post("/tasks").send({ title: "Delete me" });

    const deleteResponse = await request(app).delete(`/tasks/${created.body.task.id}`);
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(`/tasks/${created.body.task.id}`);
    expect(getResponse.status).toBe(404);
  });

  it("returns 400 for non-uuid task id", async () => {
    const app = createApp();

    const response = await request(app).get("/tasks/not-a-uuid");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
