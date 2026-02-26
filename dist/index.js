"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metrics_1 = require("./metrics");
const render_1 = require("./render");
const REFRESH_INTERVAL_MS = 2000;
let previousSample = (0, metrics_1.takeCpuSample)();
function tick() {
    const currentSample = (0, metrics_1.takeCpuSample)();
    const cpuPercent = (0, metrics_1.calculateCpuPercent)(previousSample, currentSample);
    previousSample = currentSample;
    const metrics = (0, metrics_1.collectMetrics)(cpuPercent);
    (0, render_1.render)(metrics);
}
tick();
setInterval(tick, REFRESH_INTERVAL_MS);
