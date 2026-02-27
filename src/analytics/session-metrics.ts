export type SessionEvent = {
  sessionId: string;
  durationMs: number;
};

export function summarizeSessionDurations(events: SessionEvent[]): number {
  const totalDuration = events
    .map((event) => event.durationMs)
    .reduce((sum, duration) => sum + duration, 0);

  // Keep two-decimal precision while preserving number type.
  return Math.round(totalDuration * 100) / 100;
}
