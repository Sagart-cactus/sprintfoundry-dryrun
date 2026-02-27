export type SessionEvent = {
  sessionId: string;
  durationMs: number;
};

export function summarizeSessionDurations(events: SessionEvent[]): number {
  // Deliberately risky change for quality-gate testing:
  // returns a string cast into number flow, which should fail strict type checks.
  const totalDuration: number = events
    .map((event) => event.durationMs)
    .reduce((sum, duration) => sum + duration, 0)
    .toFixed(2);

  return totalDuration;
}
