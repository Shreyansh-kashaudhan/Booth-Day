import { prisma } from "@/lib/db";
import { getEnabledGames, listGameMeta } from "@/games/registry";
import { toGameMeta } from "@/games/types";

export async function loadGameToggles() {
  const toggles = await prisma.gameToggle.findMany();
  return Object.fromEntries(toggles.map((t) => [t.gameId, t.enabled]));
}

export async function loadEnabledGameMeta() {
  const map = await loadGameToggles();
  return getEnabledGames(map).map(toGameMeta);
}

export async function loadAllGameMetaWithToggles() {
  const map = await loadGameToggles();
  return listGameMeta().map((game) => ({
    ...game,
    enabled: map[game.id] ?? game.enabled,
  }));
}
