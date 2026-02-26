import * as os from 'os';
import { execSync } from 'child_process';

export interface ProcessInfo {
  pid: string;
  cpu: number;
  mem: number;
  command: string;
}

export interface Metrics {
  cpuPercent: number;
  memUsedGB: number;
  memTotalGB: number;
  memPercent: number;
  topProcesses: ProcessInfo[];
  uptimeSeconds: number;
}

export interface CpuSample {
  idle: number;
  total: number;
}

export function takeCpuSample(): CpuSample {
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

export function calculateCpuPercent(sample1: CpuSample, sample2: CpuSample): number {
  const idleDiff = sample2.idle - sample1.idle;
  const totalDiff = sample2.total - sample1.total;
  if (totalDiff === 0) return 0;
  return Math.min(100, Math.max(0, Math.round((1 - idleDiff / totalDiff) * 100)));
}

export function getMemoryMetrics(): { usedGB: number; totalGB: number; percent: number } {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const bytesToGB = (bytes: number): number => bytes / 1024 ** 3;
  return {
    usedGB: bytesToGB(used),
    totalGB: bytesToGB(total),
    percent: Math.round((used / total) * 100),
  };
}

export function getTopProcesses(): ProcessInfo[] {
  try {
    const output = execSync('ps aux', { encoding: 'utf8', timeout: 5000 });
    const lines = output.trim().split('\n').slice(1);
    const processes: ProcessInfo[] = lines
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
  } catch {
    return [];
  }
}

export function collectMetrics(cpuPercent: number): Metrics {
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
