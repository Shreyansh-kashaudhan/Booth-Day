import type { GameResult } from "@/lib/scoring";

export type GameMeta = {
  id: string;
  name: string;
  description: string;
  howToPlay: string;
  icon: string;
  accent: string;
  enabled: boolean;
  weight: number;
  maxScore: number;
};

export type GameDefinition = GameMeta & {
  scoreFromPayload: (payload: unknown) => GameResult | { error: string };
};

export function toGameMeta(game: GameDefinition): GameMeta {
  return {
    id: game.id,
    name: game.name,
    description: game.description,
    howToPlay: game.howToPlay,
    icon: game.icon,
    accent: game.accent,
    enabled: game.enabled,
    weight: game.weight,
    maxScore: game.maxScore,
  };
}

export type GameComponentProps = {
  onComplete: (payload: unknown) => void;
};
