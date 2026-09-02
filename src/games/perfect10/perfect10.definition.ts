import { clampScore, type GameResult } from "@/lib/scoring";
import { PERFECT10_CONFIG } from "@/games/perfect10/perfect10.data";
import type { GameDefinition } from "@/games/types";

export type Perfect10Payload = { elapsedMs?: number; attemptsMs?: number[] };
export type Perfect10Runtime = { targetSeconds: number; attempts: number };

export function bestElapsedMs(attemptsMs: number[], targetSeconds = PERFECT10_CONFIG.targetSeconds): number {
  const target = targetSeconds * 1000;
  return attemptsMs.reduce((best, t) => (Math.abs(t - target) < Math.abs(best - target) ? t : best));
}

export function scorePerfect10(elapsedMs: number, targetSeconds = PERFECT10_CONFIG.targetSeconds): GameResult {
  const elapsed = elapsedMs / 1000;
  const delta = Math.abs(elapsed - targetSeconds);
  const row = PERFECT10_CONFIG.thresholds.find((t) => delta <= t.maxDelta) ?? PERFECT10_CONFIG.thresholds.at(-1)!;
  return {
    score: clampScore(row.score, 100),
    maxScore: 100,
    stats: { elapsed, delta, target: targetSeconds },
  };
}

function validTime(ms: number): boolean {
  return Number.isFinite(ms) && ms >= 0 && ms <= 60_000;
}

export function scorePerfect10Payload(
  payload: unknown,
  runtime: Perfect10Runtime = {
    targetSeconds: PERFECT10_CONFIG.targetSeconds,
    attempts: PERFECT10_CONFIG.attempts,
  },
): GameResult | { error: string } {
  if (!payload || typeof payload !== "object") return { error: "Invalid Perfect 10 payload" };
  const body = payload as Perfect10Payload;
  const attempts = body.attemptsMs ?? (typeof body.elapsedMs === "number" ? [body.elapsedMs] : null);
  if (!attempts || attempts.length === 0 || attempts.length > runtime.attempts) {
    return { error: "Invalid time" };
  }
  if (!attempts.every(validTime)) return { error: "Invalid time" };
  const elapsedMs = bestElapsedMs(attempts, runtime.targetSeconds);
  const result = scorePerfect10(elapsedMs, runtime.targetSeconds);
  return { ...result, stats: { ...result.stats, attemptsMs: attempts } };
}

export const perfect10Definition: GameDefinition = {
  id: "perfect10",
  name: "Perfect 10",
  description: "Stop on 10.00 seconds.",
  howToPlay: "You get 3 tries. Start and stop with the button or spacebar. Your closest to 10.00 counts.",
  icon: "⏱️",
  accent: "#ffc53d",
  enabled: true,
  weight: 1,
  maxScore: 100,
  scoreFromPayload: scorePerfect10Payload,
};
