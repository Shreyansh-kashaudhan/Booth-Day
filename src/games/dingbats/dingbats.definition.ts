import { clampScore, type GameResult } from "@/lib/scoring";
import { normalizeAnswer } from "@/lib/sanitize";
import { DINGBAT_PUZZLES, DINGBATS_CONFIG } from "@/games/dingbats/dingbats.data";
import type { GameDefinition } from "@/games/types";

export type DingbatAnswer = { id: string; guess: string; usedHint: boolean };

export type DingbatsPayload = { answers: DingbatAnswer[] };

function matches(puzzleId: string, guess: string, puzzles = DINGBAT_PUZZLES): boolean {
  const puzzle = puzzles.find((p) => p.id === puzzleId);
  if (!puzzle) return false;
  const normalized = normalizeAnswer(guess);
  const options = [puzzle.answer, ...(puzzle.acceptedAnswers ?? [])].map(normalizeAnswer);
  return options.includes(normalized);
}

export function scoreDingbats(payload: unknown, puzzles = DINGBAT_PUZZLES): GameResult | { error: string } {
  if (!payload || typeof payload !== "object" || !("answers" in payload)) {
    return { error: "Invalid Dingbats payload" };
  }
  const answers = (payload as DingbatsPayload).answers;
  if (!Array.isArray(answers)) return { error: "Invalid answers" };

  let correct = 0;
  let hintCount = 0;
  for (const item of answers) {
    if (!item || typeof item.id !== "string" || typeof item.guess !== "string") {
      return { error: "Invalid answer row" };
    }
    if (matches(item.id, item.guess, puzzles)) {
      correct += 1;
      if (item.usedHint) hintCount += 1;
    }
  }

  const total = answers.length;
  const maxScore = 100;
  const raw = total === 0 ? 0 : Math.round((correct / total) * maxScore) - hintCount * DINGBATS_CONFIG.hintPenalty;
  return {
    score: clampScore(raw, maxScore),
    maxScore,
    stats: { correct, total: answers.length },
  };
}

export function dingbatMatches(id: string, guess: string, puzzles = DINGBAT_PUZZLES): boolean {
  return matches(id, guess, puzzles);
}

export const dingbatsDefinition: GameDefinition = {
  id: "dingbats",
  name: "Dingbats",
  description: "Guess the phrase.",
  howToPlay: "Read the layout of the words. Type the phrase. You get 3 guesses per puzzle.",
  icon: "🧩",
  accent: "#c77dff",
  enabled: true,
  weight: 1,
  maxScore: 100,
  scoreFromPayload: scoreDingbats,
};
