import { describe, expect, it } from "vitest";
import { getEnabledGames, games } from "@/games/registry";
import type { GameDefinition } from "@/games/types";

describe("game registry", () => {
  it("lists the built-in games", () => {
    expect(games.map((g) => g.id).sort()).toEqual(["botOrNot", "dingbats", "perfect10", "wordle"].sort());
  });

  it("picks up a fifth registered game without other changes", () => {
    const extra: GameDefinition = {
      id: "memory",
      name: "Memory",
      description: "Match tiles",
      howToPlay: "Flip two.",
      icon: "🧠",
      accent: "#fff",
      enabled: true,
      weight: 1,
      maxScore: 100,
      scoreFromPayload: () => ({ score: 1, maxScore: 100, stats: {} }),
    };
    const extended = [...games, extra];
    expect(extended.map((g) => g.id)).toContain("memory");
    expect(getEnabledGames.call({ games: extended })).toBeTruthy();
    const enabled = extended.filter((g) => g.enabled);
    expect(enabled.find((g) => g.id === "memory")).toBeTruthy();
  });
});
