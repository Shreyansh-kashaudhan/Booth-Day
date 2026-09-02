export type TileState = "correct" | "present" | "absent";

export function evaluateGuess(guess: string, target: string): TileState[] {
  const g = guess.toUpperCase().split("");
  const t = target.toUpperCase().split("");
  const result: TileState[] = Array(g.length).fill("absent");
  const remaining: Record<string, number> = {};

  for (let i = 0; i < t.length; i++) {
    if (g[i] === t[i]) {
      result[i] = "correct";
    } else {
      remaining[t[i]] = (remaining[t[i]] ?? 0) + 1;
    }
  }

  for (let i = 0; i < g.length; i++) {
    if (result[i] === "correct") continue;
    const letter = g[i];
    if (remaining[letter] > 0) {
      result[i] = "present";
      remaining[letter] -= 1;
    }
  }

  return result;
}

export function isWin(tiles: TileState[]): boolean {
  return tiles.length > 0 && tiles.every((t) => t === "correct");
}
