"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const metrics_1 = require("./metrics");
(0, vitest_1.describe)('calculateCpuPercent', () => {
    (0, vitest_1.it)('returns 0 when total diff is zero', () => {
        const sample = { idle: 100, total: 200 };
        (0, vitest_1.expect)((0, metrics_1.calculateCpuPercent)(sample, sample)).toBe(0);
    });
    (0, vitest_1.it)('returns correct percentage', () => {
        const sample1 = { idle: 800, total: 1000 };
        const sample2 = { idle: 850, total: 1100 };
        const percent = (0, metrics_1.calculateCpuPercent)(sample1, sample2);
        (0, vitest_1.expect)(percent).toBe(50);
    });
    (0, vitest_1.it)('clamps result between 0 and 100', () => {
        const sample1 = { idle: 0, total: 0 };
        const sample2 = { idle: 0, total: 100 };
        const percent = (0, metrics_1.calculateCpuPercent)(sample1, sample2);
        (0, vitest_1.expect)(percent).toBeGreaterThanOrEqual(0);
        (0, vitest_1.expect)(percent).toBeLessThanOrEqual(100);
    });
});
(0, vitest_1.describe)('takeCpuSample', () => {
    (0, vitest_1.it)('returns a sample with idle and total', () => {
        const sample = (0, metrics_1.takeCpuSample)();
        (0, vitest_1.expect)(sample.idle).toBeGreaterThan(0);
        (0, vitest_1.expect)(sample.total).toBeGreaterThan(0);
        (0, vitest_1.expect)(sample.total).toBeGreaterThanOrEqual(sample.idle);
    });
});
(0, vitest_1.describe)('getMemoryMetrics', () => {
    (0, vitest_1.it)('returns positive memory values', () => {
        const mem = (0, metrics_1.getMemoryMetrics)();
        (0, vitest_1.expect)(mem.totalGB).toBeGreaterThan(0);
        (0, vitest_1.expect)(mem.usedGB).toBeGreaterThan(0);
        (0, vitest_1.expect)(mem.usedGB).toBeLessThanOrEqual(mem.totalGB);
        (0, vitest_1.expect)(mem.percent).toBeGreaterThan(0);
        (0, vitest_1.expect)(mem.percent).toBeLessThanOrEqual(100);
    });
});
