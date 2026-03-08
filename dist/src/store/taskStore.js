"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStore = void 0;
const node_crypto_1 = require("node:crypto");
const VALID_STATUS_TRANSITIONS = {
    todo: ["in_progress"],
    in_progress: ["done"],
    done: []
};
class TaskStore {
    tasks = new Map();
    list() {
        return Array.from(this.tasks.values());
    }
    create(title, description) {
        const task = {
            id: (0, node_crypto_1.randomUUID)(),
            title,
            description,
            status: "todo",
            createdAt: new Date().toISOString()
        };
        this.tasks.set(task.id, task);
        return task;
    }
    getById(id) {
        return this.tasks.get(id);
    }
    deleteById(id) {
        return this.tasks.delete(id);
    }
    updateById(id, patch) {
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
        const updated = {
            ...existing,
            ...patch
        };
        this.tasks.set(id, updated);
        return updated;
    }
    clear() {
        this.tasks.clear();
    }
}
exports.TaskStore = TaskStore;
