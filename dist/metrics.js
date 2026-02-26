"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectMetrics = collectMetrics;
const os = __importStar(require("os"));
const child_process_1 = require("child_process");
let previousCpuTimes = null;
function sumCpuTimes(cpus) {
    return cpus.reduce((acc, cpu) => ({
        user: acc.user + cpu.times.user,
        nice: acc.nice + cpu.times.nice,
        sys: acc.sys + cpu.times.sys,
        idle: acc.idle + cpu.times.idle,
        irq: acc.irq + cpu.times.irq,
    }), { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 });
}
function calculateCpuPercent(prev, curr) {
    const prevTotal = prev.user + prev.nice + prev.sys + prev.idle + prev.irq;
    const currTotal = curr.user + curr.nice + curr.sys + curr.idle + curr.irq;
    const totalDiff = currTotal - prevTotal;
    const idleDiff = curr.idle - prev.idle;
    if (totalDiff === 0)
        return 0;
    return Math.round(((totalDiff - idleDiff) / totalDiff) * 100);
}
function getTopProcesses() {
    try {
        const output = (0, child_process_1.execSync)("ps -axo pid,comm,%cpu 2>/dev/null", { encoding: "utf8", timeout: 2000 });
        const lines = output.trim().split("\n").slice(1);
        const processes = lines
            .map((line) => {
            const parts = line.trim().split(/\s+/);
            return {
                pid: parseInt(parts[0] ?? "0", 10),
                name: parts[1] ?? "unknown",
                cpu: parseFloat(parts[2] ?? "0"),
            };
        })
            .filter((p) => !isNaN(p.pid) && !isNaN(p.cpu));
        processes.sort((a, b) => b.cpu - a.cpu);
        return processes.slice(0, 3);
    }
    catch {
        return [];
    }
}
function collectMetrics() {
    const cpus = os.cpus();
    const currCpuTimes = sumCpuTimes(cpus);
    let cpuPercent = 0;
    if (previousCpuTimes !== null) {
        cpuPercent = calculateCpuPercent(previousCpuTimes, currCpuTimes);
    }
    previousCpuTimes = currCpuTimes;
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const MB = 1024 * 1024;
    return {
        cpuPercent,
        memUsedMB: Math.round(usedMem / MB),
        memTotalMB: Math.round(totalMem / MB),
        memPercent: Math.round((usedMem / totalMem) * 100),
        uptimeSeconds: Math.floor(os.uptime()),
        topProcesses: getTopProcesses(),
    };
}
