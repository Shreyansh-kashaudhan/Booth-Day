import { wordBattleDefinition } from "@/games/wordle/wordle.definition";
import { dingbatsDefinition } from "@/games/dingbats/dingbats.definition";
import { perfect10Definition } from "@/games/perfect10/perfect10.definition";
import { botOrNotDefinition } from "@/games/botOrNot/botOrNot.definition";
import { toGameMeta, type GameDefinition, type GameMeta } from "@/games/types";

export const games: GameDefinition[] = [
  wordBattleDefinition,
  dingbatsDefinition,
  perfect10Definition,
  botOrNotDefinition,
];

export function listGameMeta(): GameMeta[] {
  return games.map(toGameMeta);
}

export function getGame(id: string): GameDefinition | undefined {
  return games.find((game) => game.id === id);
}

export function getEnabledGames(toggles?: Record<string, boolean>): GameDefinition[] {
  return games.filter((game) => (toggles?.[game.id] ?? game.enabled) === true);
}
