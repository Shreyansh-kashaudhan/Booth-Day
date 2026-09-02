import { clampScore, type GameResult } from "@/lib/scoring";
import { evaluateGuess, isWin } from "@/games/wordle/wordle.logic";
import { WORD_BATTLE_CONFIG, WORD_BATTLE_WORDS } from "@/games/wordle/wordle.data";
import type { GameDefinition } from "@/games/types";

export type WordBattlePayload = {
  word: string;
  guesses: string[];
};

function isPayload(value: unknown): value is WordBattlePayload {
  if (!value || typeof value !== "object") return false;
  const v = value as WordBattlePayload;
  return typeof v.word === "string" && Array.isArray(v.guesses) && v.guesses.every((g) => typeof g === "string");
}

export function scoreWordBattle(payload: unknown, words = WORD_BATTLE_WORDS): GameResult | { error: string } {
  if (!isPayload(payload)) return { error: "Invalid Word Battle payload" };
  const word = payload.word.toUpperCase();
  const allowed = words.some((w) => w.word.toUpperCase() === word);
  if (!allowed) return { error: "Unknown word" };
  if (word.length !== WORD_BATTLE_CONFIG.wordLength) return { error: "Unexpected word length" };
  if (payload.guesses.length > WORD_BATTLE_CONFIG.attempts) return { error: "Too many guesses" };

  let wonAt: number | null = null;
  for (let i = 0; i < payload.guesses.length; i++) {
    const guess = payload.guesses[i].toUpperCase();
    if (guess.length !== word.length) return { error: "Invalid guess" };
    const tiles = evaluateGuess(guess, word);
    if (isWin(tiles)) {
      wonAt = i;
      break;
    }
  }

  const maxScore = 100;
  const score =
    wonAt === null
      ? WORD_BATTLE_CONFIG.loseScore
      : (WORD_BATTLE_CONFIG.winScoresByAttempt[wonAt] ?? WORD_BATTLE_CONFIG.loseScore);

  return {
    score: clampScore(score, maxScore),
    maxScore,
    stats: { attempts: payload.guesses.length, won: wonAt !== null, word },
  };
}

export const wordBattleDefinition: GameDefinition = {
  id: "wordle",
  name: "Word Battle",
  description: "Guess the secret word.",
  howToPlay: "You have 6 tries to guess a 5-letter word. Green is right spot. Gold is in the word.",
  icon: "🟩",
  accent: "#3dff8a",
  enabled: true,
  weight: 1,
  maxScore: 100,
  scoreFromPayload: scoreWordBattle,
};
