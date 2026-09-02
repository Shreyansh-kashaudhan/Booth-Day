export const PERFECT10_CONFIG = {
  attempts: 3,
  targetSeconds: 10,
  thresholds: [
    { maxDelta: 0.05, score: 100 },
    { maxDelta: 0.1, score: 90 },
    { maxDelta: 0.25, score: 75 },
    { maxDelta: 0.5, score: 50 },
    { maxDelta: 1, score: 25 },
    { maxDelta: Number.POSITIVE_INFINITY, score: 10 },
  ],
};
