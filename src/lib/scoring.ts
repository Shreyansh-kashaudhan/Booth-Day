export type GameResult = {
  score: number;
  maxScore: number;
  stats: Record<string, unknown>;
};

export function clampScore(score: number, maxScore: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(maxScore, Math.round(score)));
}
