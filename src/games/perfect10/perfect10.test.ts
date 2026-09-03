import { describe, expect, it } from "vitest";
import { scorePerfect10, scorePerfect10Payload } from "@/games/perfect10/perfect10.definition";
import { runningTimerOpacity } from "@/games/perfect10/perfect10.data";

describe("Perfect 10 scoring", () => {
  it("gives 100 within 0.05s", () => {
    expect(scorePerfect10(10020).score).toBe(100);
  });

  it("gives 90 within 0.10s", () => {
    expect(scorePerfect10(10070).score).toBe(90);
  });

  it("gives 75 within 0.25s", () => {
    expect(scorePerfect10(10200).score).toBe(75);
  });

  it("gives 50 within 0.50s", () => {
    expect(scorePerfect10(10400).score).toBe(50);
  });

  it("handles early stop", () => {
    expect(scorePerfect10(0).score).toBe(10);
  });

  it("handles exact 10", () => {
    expect(scorePerfect10(10000).score).toBe(100);
  });

  it("uses the closest of three tries", () => {
    const result = scorePerfect10Payload({ attemptsMs: [8000, 10040, 14000] });
    expect(result).toMatchObject({ score: 100 });
  });
});

describe("Perfect 10 timer fade", () => {
  it("stays fully visible before 6.5s", () => {
    expect(runningTimerOpacity(6)).toBe(1);
  });

  it("is nearly gone by 8.5s", () => {
    expect(runningTimerOpacity(8.5)).toBe(0.08);
  });

  it("is mid-fade around 7.5s", () => {
    expect(runningTimerOpacity(7.5)).toBeCloseTo(0.54, 2);
  });
});
