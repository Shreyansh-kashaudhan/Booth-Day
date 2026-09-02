import { clampScore, type GameResult } from "@/lib/scoring";
import { BOT_OR_NOT_CONFIG, BOT_OR_NOT_SCENARIOS } from "@/games/botOrNot/botOrNot.data";
import type { GameDefinition } from "@/games/types";

export type BotOrNotChoice = { id: string; choice: "bot" | "human" };
export type BotOrNotPayload = { choices: BotOrNotChoice[] };

export function scoreBotOrNot(payload: unknown, scenarios = BOT_OR_NOT_SCENARIOS): GameResult | { error: string } {
  if (!payload || typeof payload !== "object" || !("choices" in payload)) {
    return { error: "Invalid Bot or Not payload" };
  }
  const choices = (payload as BotOrNotPayload).choices;
  if (!Array.isArray(choices)) return { error: "Invalid choices" };

  let correct = 0;
  for (const row of choices) {
    const scenario = scenarios.find((s) => s.id === row.id);
    if (!scenario) return { error: "Unknown scenario" };
    if (row.choice !== "bot" && row.choice !== "human") return { error: "Invalid choice" };
    if (row.choice === scenario.answer) correct += 1;
  }

  const maxScore = 100;
  const score = correct * BOT_OR_NOT_CONFIG.pointsPerCorrect;
  return {
    score: clampScore(score, maxScore),
    maxScore,
    stats: { correct, total: choices.length },
  };
}

export const botOrNotDefinition: GameDefinition = {
  id: "botOrNot",
  name: "Bot or Not",
  description: "Spot the bot.",
  howToPlay: "Read the request. Tap BOT or HUMAN. You get a few of these in a row.",
  icon: "🤖",
  accent: "#22e0ff",
  enabled: true,
  weight: 1,
  maxScore: 100,
  scoreFromPayload: scoreBotOrNot,
};
