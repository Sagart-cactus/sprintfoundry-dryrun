import { collectMetrics } from "./metrics";
import { renderDashboard } from "./render";

const REFRESH_INTERVAL_MS = 2000;

function tick(): void {
  const metrics = collectMetrics();
  renderDashboard(metrics);
}

// Initial collection to seed CPU baseline; render starts on next tick
collectMetrics();

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
