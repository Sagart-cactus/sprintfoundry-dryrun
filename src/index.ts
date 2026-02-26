import { takeCpuSample, calculateCpuPercent, collectMetrics } from './metrics';
import { render } from './render';

const REFRESH_INTERVAL_MS = 2000;

let previousSample = takeCpuSample();

function tick(): void {
  const currentSample = takeCpuSample();
  const cpuPercent = calculateCpuPercent(previousSample, currentSample);
  previousSample = currentSample;
  const metrics = collectMetrics(cpuPercent);
  render(metrics);
}

tick();
setInterval(tick, REFRESH_INTERVAL_MS);
