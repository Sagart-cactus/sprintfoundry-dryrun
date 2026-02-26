import type { SystemMetrics } from "./metrics";

const CLEAR_SCREEN = "\x1b[2J\x1b[H";
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const CYAN = "\x1b[36m";

function cpuColor(cpuPercent: number): string {
  if (cpuPercent > 80) return RED;
  if (cpuPercent > 60) return YELLOW;
  return GREEN;
}

function bar(percent: number, width: number, color: string): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return color + "█".repeat(filled) + DIM + "░".repeat(empty) + RESET;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(" ");
}

function line(label: string, value: string): string {
  const paddedLabel = label.padEnd(12);
  return `  ${DIM}${paddedLabel}${RESET}${value}`;
}

export function renderDashboard(metrics: SystemMetrics): void {
  const color = cpuColor(metrics.cpuPercent);
  const output: string[] = [];

  output.push(CLEAR_SCREEN);
  output.push(
    `${BOLD}${CYAN}╔══════════════════════════════════╗${RESET}`
  );
  output.push(
    `${BOLD}${CYAN}║         devpulse  dashboard      ║${RESET}`
  );
  output.push(
    `${BOLD}${CYAN}╚══════════════════════════════════╝${RESET}`
  );
  output.push("");

  // CPU section
  output.push(`  ${BOLD}CPU${RESET}`);
  output.push(
    line(
      "Usage:",
      `${color}${BOLD}${metrics.cpuPercent.toString().padStart(3)}%${RESET}  ${bar(metrics.cpuPercent, 20, color)}`
    )
  );
  output.push("");

  // Memory section
  const memColor = cpuColor(metrics.memPercent);
  output.push(`  ${BOLD}Memory${RESET}`);
  output.push(
    line(
      "Used:",
      `${memColor}${BOLD}${metrics.memUsedMB} MB${RESET} / ${metrics.memTotalMB} MB  (${metrics.memPercent}%)`
    )
  );
  output.push(
    `                ${bar(metrics.memPercent, 20, memColor)}`
  );
  output.push("");

  // System section
  output.push(`  ${BOLD}System${RESET}`);
  output.push(line("Uptime:", `${GREEN}${formatUptime(metrics.uptimeSeconds)}${RESET}`));
  output.push("");

  // Top processes
  if (metrics.topProcesses.length > 0) {
    output.push(`  ${BOLD}Top Processes${RESET}`);
    output.push(
      `  ${DIM}${"PID".padEnd(8)}${"NAME".padEnd(24)}CPU%${RESET}`
    );
    output.push(`  ${DIM}${"─".repeat(36)}${RESET}`);

    for (const proc of metrics.topProcesses) {
      const procColor = cpuColor(proc.cpu);
      const pidStr = proc.pid.toString().padEnd(8);
      const nameStr = proc.name.slice(0, 22).padEnd(24);
      const cpuStr = `${procColor}${proc.cpu.toFixed(1)}%${RESET}`;
      output.push(`  ${pidStr}${nameStr}${cpuStr}`);
    }
    output.push("");
  }

  output.push(`  ${DIM}Refreshing every 2s — Ctrl+C to quit${RESET}`);

  process.stdout.write(output.join("\n"));
}
