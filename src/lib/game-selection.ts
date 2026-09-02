export type WeightedGame = { id: string; weight: number };

export function pickWeightedGame<T extends WeightedGame>(games: T[]): T {
  if (games.length === 0) {
    throw new Error("No games available");
  }
  const total = games.reduce((sum, game) => sum + Math.max(0, game.weight), 0);
  let roll = Math.random() * (total || games.length);
  for (const game of games) {
    roll -= total === 0 ? 1 : Math.max(0, game.weight);
    if (roll <= 0) return game;
  }
  return games[games.length - 1];
}

export function wheelStopRotation(gameCount: number, selectedIndex: number, spins = 6): number {
  const slice = 360 / gameCount;
  const center = selectedIndex * slice + slice / 2;
  return spins * 360 + (360 - center);
}
