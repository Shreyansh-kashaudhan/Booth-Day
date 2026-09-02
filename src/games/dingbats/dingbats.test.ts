import { describe, expect, it } from "vitest";
import { dingbatMatches, scoreDingbats } from "@/games/dingbats/dingbats.definition";
import { pickPuzzles, DINGBAT_PUZZLES } from "@/games/dingbats/dingbats.data";

describe("Dingbats matching", () => {
  it("matches the canonical answer", () => {
    expect(dingbatMatches("db-001", "man overboard")).toBe(true);
  });

  it("matches accepted answers", () => {
    expect(dingbatMatches("db-001", "MAN OVER BOARD")).toBe(true);
  });

  it("rejects wrong answers", () => {
    expect(dingbatMatches("db-001", "overboard man")).toBe(false);
  });

  it("matches Get Ship Done", () => {
    expect(dingbatMatches("hn-001", "get ship done")).toBe(true);
  });

  it("matches runtime protection", () => {
    expect(dingbatMatches("hn-002", "runtime protection")).toBe(true);
  });

  it("accepts lowercase and no spaces", () => {
    expect(dingbatMatches("hn-001", "getshipdone")).toBe(true);
    expect(dingbatMatches("hn-002", "  RunTimeProtection  ")).toBe(true);
    expect(dingbatMatches("hn-003", "featureflags")).toBe(true);
  });

  it("matches land speed violation", () => {
    expect(dingbatMatches("ap-001", "land speed violation")).toBe(true);
  });
});

describe("Dingbats scoring", () => {
  it("scores three correct puzzles", () => {
    const result = scoreDingbats({
      answers: [
        { id: "db-001", guess: "man overboard", usedHint: false },
        { id: "db-002", guess: "tricycle", usedHint: false },
        { id: "db-003", guess: "bicycle", usedHint: false },
      ],
    });
    expect(result).toMatchObject({ maxScore: 100 });
    if ("score" in result) expect(result.score).toBe(100);
  });

  it("defaults to Harness team puzzles", () => {
    const round = pickPuzzles(3, DINGBAT_PUZZLES);
    expect(round.every((p) => p.set === "harness")).toBe(true);
    expect(round).toHaveLength(3);
  });

  it("can mix sets when configured", () => {
    const round = pickPuzzles(3, DINGBAT_PUZZLES, ["harness", "api-protection", "classic"]);
    const sets = new Set(round.map((p) => p.set ?? "classic"));
    expect(sets.has("harness")).toBe(true);
    expect(sets.has("api-protection")).toBe(true);
    expect(sets.has("classic")).toBe(true);
  });
});
