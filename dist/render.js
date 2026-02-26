"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = render;
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const BAR_WIDTH = 30;
function cpuColor(percent) {
    if (percent <= 60)
        return GREEN;
    if (percent <= 80)
        return YELLOW;
    return RED;
}
function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
}
function progressBar(percent, color) {
    const filled = Math.round((percent / 100) * BAR_WIDTH);
    const empty = BAR_WIDTH - filled;
    return `${color}${'█'.repeat(filled)}${DIM}${'░'.repeat(empty)}${RESET}`;
}
function renderProcess(proc, index) {
    const cmd = proc.command.length > 28 ? proc.command.slice(0, 25) + '...' : proc.command;
    return (`  ${DIM}${index + 1}.${RESET} ${cmd.padEnd(28)} ` +
        `CPU: ${proc.cpu.toFixed(1).padStart(5)}%  MEM: ${proc.mem.toFixed(1).padStart(5)}%`);
}
function render(metrics) {
    const color = cpuColor(metrics.cpuPercent);
    const lines = [
        '',
        `  ${BOLD}${CYAN}devpulse${RESET}  ${DIM}system metrics${RESET}`,
        '',
        `  ${BOLD}CPU   ${RESET}${color}${String(metrics.cpuPercent).padStart(3)}%${RESET}  ${progressBar(metrics.cpuPercent, color)}`,
        '',
        `  ${BOLD}MEM   ${RESET}${String(metrics.memPercent).padStart(3)}%  ${progressBar(metrics.memPercent, GREEN)}  ${DIM}${metrics.memUsedGB.toFixed(1)} GB / ${metrics.memTotalGB.toFixed(1)} GB${RESET}`,
        '',
        `  ${BOLD}UPTIME${RESET}  ${formatUptime(metrics.uptimeSeconds)}`,
        '',
        `  ${BOLD}TOP PROCESSES${RESET}`,
        ...metrics.topProcesses.map(renderProcess),
        '',
        `  ${DIM}Refreshing every 2s — Ctrl+C to exit${RESET}`,
        '',
    ];
    process.stdout.write('\x1b[2J\x1b[H' + lines.join('\n'));
}
