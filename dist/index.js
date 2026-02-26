"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metrics_1 = require("./metrics");
const render_1 = require("./render");
const REFRESH_INTERVAL_MS = 2000;
function tick() {
    const metrics = (0, metrics_1.collectMetrics)();
    (0, render_1.renderDashboard)(metrics);
}
// Initial collection to seed CPU baseline; render starts on next tick
(0, metrics_1.collectMetrics)();
const timer = setInterval(tick, REFRESH_INTERVAL_MS);
process.on("SIGINT", () => {
    clearInterval(timer);
    process.stdout.write("\n\x1b[?25h"); // restore cursor
    process.exit(0);
});
process.on("SIGTERM", () => {
    clearInterval(timer);
    process.stdout.write("\n\x1b[?25h");
    process.exit(0);
});
