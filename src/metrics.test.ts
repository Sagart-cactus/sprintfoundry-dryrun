import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockCpus,
  mockTotalmem,
  mockFreemem,
  mockUptime,
  mockExecSync,
} = vi.hoisted(() => ({
  mockCpus: vi.fn(),
  mockTotalmem: vi.fn(),
  mockFreemem: vi.fn(),
  mockUptime: vi.fn(),
  mockExecSync: vi.fn(),
}));

vi.mock('os', () => ({
  cpus: mockCpus,
  totalmem: mockTotalmem,
  freemem: mockFreemem,
  uptime: mockUptime,
}));

vi.mock('child_process', () => ({
  execSync: mockExecSync,
}));

import { calculateCpuPercent, collectMetrics, takeCpuSample } from './metrics';

describe('metrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates CPU usage percent from mocked idle/total CPU times', () => {
    mockCpus
      .mockReturnValueOnce([
        { times: { user: 100, nice: 0, sys: 50, idle: 850, irq: 0 } },
        { times: { user: 200, nice: 0, sys: 100, idle: 1700, irq: 0 } },
      ])
      .mockReturnValueOnce([
        { times: { user: 120, nice: 0, sys: 70, idle: 860, irq: 0 } },
        { times: { user: 230, nice: 0, sys: 130, idle: 1710, irq: 0 } },
      ]);

    const sample1 = takeCpuSample();
    const sample2 = takeCpuSample();

    const cpuPercent = calculateCpuPercent(sample1, sample2);

    expect(sample1).toEqual({ idle: 2550, total: 3000 });
    expect(sample2).toEqual({ idle: 2570, total: 3120 });
    expect(cpuPercent).toBe(83);
  });

  it('derives memory used from totalmem - freemem and passes uptime through', () => {
    mockTotalmem.mockReturnValue(16 * 1024 ** 3);
    mockFreemem.mockReturnValue(6 * 1024 ** 3);
    mockUptime.mockReturnValue(12345);
    mockExecSync.mockReturnValue('USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND\n');

    const metrics = collectMetrics(42);

    expect(metrics.memTotalGB).toBe(16);
    expect(metrics.memUsedGB).toBe(10);
    expect(metrics.memPercent).toBe(63);
    expect(metrics.uptimeSeconds).toBe(12345);
  });

  it('sorts top processes by CPU and limits to top 3', () => {
    mockTotalmem.mockReturnValue(8 * 1024 ** 3);
    mockFreemem.mockReturnValue(4 * 1024 ** 3);
    mockUptime.mockReturnValue(99);
    mockExecSync.mockReturnValue([
      'USER       PID  %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND',
      'alice      100   0.5  0.1 123456  1000 ??       S     10:00   0:01 /bin/a',
      'bob        101  15.3  0.2 123456  1000 ??       S     10:00   0:02 /bin/b',
      'carol      102   7.8  0.3 123456  1000 ??       S     10:00   0:03 /bin/c',
      'dave       103  50.1  0.4 123456  1000 ??       S     10:00   0:04 /bin/d',
      'erin       104  22.4  0.5 123456  1000 ??       S     10:00   0:05 /bin/e',
    ].join('\n'));

    const metrics = collectMetrics(10);

    expect(metrics.topProcesses).toHaveLength(3);
    expect(metrics.topProcesses.map(p => p.pid)).toEqual(['103', '104', '101']);
    expect(metrics.topProcesses.map(p => p.cpu)).toEqual([50.1, 22.4, 15.3]);
  });
});
