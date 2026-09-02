import { describe, expect, it } from "vitest";
import { evaluateGuess, isWin } from "@/games/wordle/wordle.logic";
import { scoreWordBattle } from "@/games/wordle/wordle.definition";

describe("Word Battle tiles", () => {
  it("marks correct letters", () => {
    expect(evaluateGuess("BLOCK", "BLOCK")).toEqual(["correct", "correct", "correct", "correct", "correct"]);
  });

  it("marks present vs absent", () => {
    expect(evaluateGuess("ROBOT", "TOKEN")).toEqual(["absent", "correct", "absent", "absent", "present"]);
  });

  it("handles duplicate letters", () => {
    expect(evaluateGuess("LLAMA", "ALLOY")).toEqual(["present", "correct", "present", "absent", "absent"]);
  });

  it("wins on full match", () => {
    expect(isWin(evaluateGuess("GUARD", "GUARD"))).toBe(true);
  });

  it("loses on miss", () => {
    expect(isWin(evaluateGuess("GUARD", "BLOCK"))).toBe(false);
  });
});

describe("Word Battle scoring", () => {
  it("scores a first-try win at 100", () => {
    const result = scoreWordBattle({ word: "BLOCK", guesses: ["BLOCK"] });
    expect(result).toMatchObject({ score: 100, maxScore: 100 });
  });

  it("rejects unknown words", () => {
    expect(scoreWordBattle({ word: "ZZZZZ", guesses: ["ZZZZZ"] })).toMatchObject({ error: "Unknown word" });
  });
});
