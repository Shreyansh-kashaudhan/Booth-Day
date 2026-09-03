export const PERFECT10_CONFIG = {
  attempts: 3,
  targetSeconds: 10,
  timerFadeStartSeconds: 6.5,
  timerFadeEndSeconds: 8.5,
  timerMinOpacity: 0.08,
  thresholds: [
    { maxDelta: 0.05, score: 100 },
    { maxDelta: 0.1, score: 90 },
    { maxDelta: 0.25, score: 75 },
    { maxDelta: 0.5, score: 50 },
    { maxDelta: 1, score: 25 },
    { maxDelta: Number.POSITIVE_INFINITY, score: 10 },
  ],
};

export function runningTimerOpacity(elapsedSeconds: number): number {
  const { timerFadeStartSeconds, timerFadeEndSeconds, timerMinOpacity } = PERFECT10_CONFIG;
  if (elapsedSeconds < timerFadeStartSeconds) return 1;
  if (elapsedSeconds >= timerFadeEndSeconds) return timerMinOpacity;
  const t = (elapsedSeconds - timerFadeStartSeconds) / (timerFadeEndSeconds - timerFadeStartSeconds);
  return 1 - t * (1 - timerMinOpacity);
}
