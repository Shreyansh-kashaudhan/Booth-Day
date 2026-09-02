import { describe, expect, it } from "vitest";
import { dingbatMatches, scoreDingbats } from "@/games/dingbats/dingbats.definition";
import { pickPuzzles, DINGBAT_PUZZLES } from "@/games/dingbats/dingbats.data";

describe("Dingbats matching", () => {
  it("matches the canonical answer", () => {
    expect(dingbatMatches("db-004", "i understand")).toBe(true);
  });

  it("matches accepted answers", () => {
    expect(dingbatMatches("db-004", "UNDERSTAND")).toBe(true);
  });

  it("rejects wrong answers", () => {
    expect(dingbatMatches("db-004", "overboard man")).toBe(false);
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

  it("matches rate limiting, SQL injection, and XSS", () => {
    expect(dingbatMatches("ap-011", "rate limiting")).toBe(true);
    expect(dingbatMatches("ap-012", "sqli")).toBe(true);
    expect(dingbatMatches("ap-013", "xss")).toBe(true);
    expect(dingbatMatches("ap-013", "crosssitescripting")).toBe(true);
  });

  it("matches pipeline and deployment", () => {
    expect(dingbatMatches("hn-007", "pipeline")).toBe(true);
    expect(dingbatMatches("hn-008", "deployment")).toBe(true);
    expect(dingbatMatches("hn-008", "deploy")).toBe(true);
  });
});

describe("Dingbats scoring", () => {
  it("scores three correct puzzles", () => {
    const result = scoreDingbats({
      answers: [
        { id: "db-004", guess: "i understand", usedHint: false },
        { id: "db-005", guess: "mind over matter", usedHint: false },
        { id: "db-007", guess: "long underwear", usedHint: false },
      ],
    });
    expect(result).toMatchObject({ maxScore: 100 });
    if ("score" in result) expect(result.score).toBe(100);
  });

  it("scores two correct puzzles out of two as 100", () => {
    const result = scoreDingbats({
      answers: [
        { id: "db-004", guess: "i understand", usedHint: false },
        { id: "db-005", guess: "mind over matter", usedHint: false },
      ],
    });
    if ("score" in result) expect(result.score).toBe(100);
  });

  it("mixes Harness and API Protection by default", () => {
    const round = pickPuzzles(3, DINGBAT_PUZZLES);
    const sets = new Set(round.map((p) => p.set ?? "classic"));
    expect(sets.has("classic")).toBe(false);
    expect(round).toHaveLength(3);
    expect(sets.has("harness")).toBe(true);
    expect(sets.has("api-protection")).toBe(true);
  });

  it("picks the requested number of puzzles and repeats if needed", () => {
    expect(pickPuzzles(2, DINGBAT_PUZZLES)).toHaveLength(2);
    expect(pickPuzzles(20, DINGBAT_PUZZLES)).toHaveLength(20);
    const tiny = DINGBAT_PUZZLES.filter((p) => p.set === "harness").slice(0, 2);
    expect(pickPuzzles(5, tiny, ["harness"])).toHaveLength(5);
  });

  it("can mix sets when configured", () => {
    const round = pickPuzzles(3, DINGBAT_PUZZLES, ["harness", "api-protection", "classic"]);
    const sets = new Set(round.map((p) => p.set ?? "classic"));
    expect(sets.has("harness")).toBe(true);
    expect(sets.has("api-protection")).toBe(true);
    expect(sets.has("classic")).toBe(true);
  });
});
