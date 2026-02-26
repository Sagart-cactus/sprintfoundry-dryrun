import * as os from "os";
import { execSync } from "child_process";

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
}

export interface SystemMetrics {
  cpuPercent: number;
  memUsedMB: number;
  memTotalMB: number;
  memPercent: number;
  uptimeSeconds: number;
  topProcesses: ProcessInfo[];
}

interface CpuTimes {
  user: number;
  nice: number;
  sys: number;
  idle: number;
  irq: number;
}

let previousCpuTimes: CpuTimes | null = null;

function sumCpuTimes(cpus: os.CpuInfo[]): CpuTimes {
  return cpus.reduce(
    (acc, cpu) => ({
      user: acc.user + cpu.times.user,
      nice: acc.nice + cpu.times.nice,
      sys: acc.sys + cpu.times.sys,
      idle: acc.idle + cpu.times.idle,
      irq: acc.irq + cpu.times.irq,
    }),
    { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }
  );
}

function calculateCpuPercent(prev: CpuTimes, curr: CpuTimes): number {
  const prevTotal =
    prev.user + prev.nice + prev.sys + prev.idle + prev.irq;
  const currTotal =
    curr.user + curr.nice + curr.sys + curr.idle + curr.irq;

  const totalDiff = currTotal - prevTotal;
  const idleDiff = curr.idle - prev.idle;

  if (totalDiff === 0) return 0;
  return Math.round(((totalDiff - idleDiff) / totalDiff) * 100);
}

function getTopProcesses(): ProcessInfo[] {
  try {
    const output = execSync(
      "ps -axo pid,comm,%cpu 2>/dev/null",
      { encoding: "utf8", timeout: 2000 }
    );

    const lines = output.trim().split("\n").slice(1);
    const processes: ProcessInfo[] = lines
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
  } catch {
    return [];
  }
}

export function collectMetrics(): SystemMetrics {
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
