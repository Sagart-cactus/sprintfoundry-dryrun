"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const errors_1 = require("./errors");
const taskStore_1 = require("./store/taskStore");
const validation_1 = require("./validation");
function createApp(taskStore = new taskStore_1.TaskStore()) {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get("/health", (_req, res) => {
        res.status(200).json({ status: "ok" });
    });
    app.get("/tasks", (_req, res) => {
        res.status(200).json({ tasks: taskStore.list() });
    });
    app.post("/tasks", (req, res) => {
        const input = (0, validation_1.parseCreateTaskInput)(req.body);
        const task = taskStore.create(input.title, input.description ?? "");
        res.status(201).json({ task });
    });
    app.get("/tasks/:id", (req, res) => {
        const id = (0, validation_1.validateTaskId)(req.params.id);
        const task = taskStore.getById(id);
        if (!task) {
            throw new errors_1.ApiError(404, "NOT_FOUND", `Task with ID '${id}' was not found`);
        }
        res.status(200).json({ task });
    });
    app.patch("/tasks/:id", (req, res) => {
        const id = (0, validation_1.validateTaskId)(req.params.id);
        const patch = (0, validation_1.parseUpdateTaskInput)(req.body);
        try {
            const updatedTask = taskStore.updateById(id, patch);
            if (!updatedTask) {
                throw new errors_1.ApiError(404, "NOT_FOUND", `Task with ID '${id}' was not found`);
            }
            res.status(200).json({ task: updatedTask });
        }
        catch (error) {
            if (error instanceof errors_1.ApiError) {
                throw error;
            }
            throw new errors_1.ApiError(409, "INVALID_STATUS_TRANSITION", error.message);
        }
    });
    app.delete("/tasks/:id", (req, res) => {
        const id = (0, validation_1.validateTaskId)(req.params.id);
        const removed = taskStore.deleteById(id);
        if (!removed) {
            throw new errors_1.ApiError(404, "NOT_FOUND", `Task with ID '${id}' was not found`);
        }
        res.status(204).send();
    });
    app.use((_req, _res, next) => {
        next(new errors_1.ApiError(404, "NOT_FOUND", "Endpoint not found"));
    });
    app.use((error, _req, res, _next) => {
        if (error instanceof errors_1.ApiError) {
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
