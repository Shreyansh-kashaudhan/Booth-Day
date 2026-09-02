import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getLeaderboard, submitScore } from "@/lib/leaderboard";

describe("leaderboard", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "arcade-"));
  const dbPath = path.join(dir, "test.db");
  let db: PrismaClient;

  beforeAll(() => {
    process.env.DATABASE_URL = `file:${dbPath}`;
    execSync("npx prisma db push --skip-generate", {
      env: { ...process.env, DATABASE_URL: `file:${dbPath}` },
      stdio: "inherit",
    });
    db = new PrismaClient({ datasources: { db: { url: `file:${dbPath}` } } });
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("inserts, sorts, and filters today", async () => {
    await submitScore(db, { displayName: "Rahul", gameId: "wordle", score: 90, maxScore: 100 });
    await submitScore(db, { displayName: "Sarah", gameId: "wordle", score: 100, maxScore: 100 });
    await submitScore(db, { displayName: "Alex", gameId: "dingbats", score: 80, maxScore: 100 });

    const overall = await getLeaderboard(db, "all");
    expect(overall[0].displayName).toBe("Sarah");
    expect(overall[1].displayName).toBe("Rahul");

    const wordle = await getLeaderboard(db, "today", "wordle");
    expect(wordle.map((r) => r.displayName)).toEqual(["Sarah", "Rahul"]);
    expect(wordle.every((r) => r.createdAt >= startOfToday())).toBe(true);
  });
});

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
