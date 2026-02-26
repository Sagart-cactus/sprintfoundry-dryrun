import { describe, it, expect } from 'vitest';
import { takeCpuSample, calculateCpuPercent, getMemoryMetrics } from './metrics';

describe('calculateCpuPercent', () => {
  it('returns 0 when total diff is zero', () => {
    const sample = { idle: 100, total: 200 };
    expect(calculateCpuPercent(sample, sample)).toBe(0);
  });

  it('returns correct percentage', () => {
    const sample1 = { idle: 800, total: 1000 };
    const sample2 = { idle: 850, total: 1100 };
    const percent = calculateCpuPercent(sample1, sample2);
    expect(percent).toBe(50);
  });

  it('clamps result between 0 and 100', () => {
    const sample1 = { idle: 0, total: 0 };
    const sample2 = { idle: 0, total: 100 };
    const percent = calculateCpuPercent(sample1, sample2);
    expect(percent).toBeGreaterThanOrEqual(0);
    expect(percent).toBeLessThanOrEqual(100);
  });
});

describe('takeCpuSample', () => {
  it('returns a sample with idle and total', () => {
    const sample = takeCpuSample();
    expect(sample.idle).toBeGreaterThan(0);
    expect(sample.total).toBeGreaterThan(0);
    expect(sample.total).toBeGreaterThanOrEqual(sample.idle);
  });
});

describe('getMemoryMetrics', () => {
  it('returns positive memory values', () => {
    const mem = getMemoryMetrics();
    expect(mem.totalGB).toBeGreaterThan(0);
    expect(mem.usedGB).toBeGreaterThan(0);
    expect(mem.usedGB).toBeLessThanOrEqual(mem.totalGB);
    expect(mem.percent).toBeGreaterThan(0);
    expect(mem.percent).toBeLessThanOrEqual(100);
  });
});
