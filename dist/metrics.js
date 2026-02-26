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
exports.takeCpuSample = takeCpuSample;
exports.calculateCpuPercent = calculateCpuPercent;
exports.getMemoryMetrics = getMemoryMetrics;
exports.getTopProcesses = getTopProcesses;
exports.collectMetrics = collectMetrics;
const os = __importStar(require("os"));
const child_process_1 = require("child_process");
function takeCpuSample() {
    const cpus = os.cpus();
    let idle = 0;
    let total = 0;
    for (const cpu of cpus) {
        for (const value of Object.values(cpu.times)) {
            total += value;
        }
        idle += cpu.times.idle;
    }
    return { idle, total };
}
function calculateCpuPercent(sample1, sample2) {
    const idleDiff = sample2.idle - sample1.idle;
    const totalDiff = sample2.total - sample1.total;
    if (totalDiff === 0)
        return 0;
    return Math.min(100, Math.max(0, Math.round((1 - idleDiff / totalDiff) * 100)));
}
function getMemoryMetrics() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const bytesToGB = (bytes) => bytes / 1024 ** 3;
    return {
        usedGB: bytesToGB(used),
        totalGB: bytesToGB(total),
        percent: Math.round((used / total) * 100),
    };
}
function getTopProcesses() {
    try {
        const output = (0, child_process_1.execSync)('ps aux', { encoding: 'utf8', timeout: 5000 });
        const lines = output.trim().split('\n').slice(1);
        const processes = lines
            .map(line => {
            const parts = line.trim().split(/\s+/);
            return {
                pid: parts[1] ?? '',
                cpu: parseFloat(parts[2] ?? '0'),
                mem: parseFloat(parts[3] ?? '0'),
                command: parts[10] ?? '',
            };
        })
            .filter(p => p.pid !== '');
        return processes.sort((a, b) => b.cpu - a.cpu).slice(0, 3);
    }
    catch {
        return [];
    }
}
function collectMetrics(cpuPercent) {
    const memory = getMemoryMetrics();
    return {
        cpuPercent,
        memUsedGB: memory.usedGB,
        memTotalGB: memory.totalGB,
        memPercent: memory.percent,
        topProcesses: getTopProcesses(),
        uptimeSeconds: os.uptime(),
    };
}
