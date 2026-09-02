import type { PrismaClient } from "@prisma/client";
import { sanitizeDisplayName } from "@/lib/sanitize";

export type LeaderboardPeriod = "today" | "all";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function periodFilter(period: LeaderboardPeriod) {
  return period === "today" ? { createdAt: { gte: startOfToday() } } : {};
}

export async function submitScore(
  db: PrismaClient,
  input: {
    displayName: string;
    gameId: string;
    score: number;
    maxScore: number;
    metadata?: Record<string, unknown>;
  },
) {
  const displayName = sanitizeDisplayName(input.displayName);
  if (!displayName) throw new Error("Invalid name");
  if (input.score < 0 || input.score > input.maxScore) throw new Error("Invalid score");

  const player = await db.player.upsert({
    where: { displayName },
    create: { displayName },
    update: {},
  });

  const row = await db.gameScore.create({
    data: {
      playerId: player.id,
      gameId: input.gameId,
      score: input.score,
      maxScore: input.maxScore,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    },
  });

  return { player, score: row };
}

export type LeaderboardRow = {
  rank: number;
  displayName: string;
  score: number;
  gameId: string;
  createdAt: Date;
};

async function bestScores(
  db: PrismaClient,
  period: LeaderboardPeriod,
  gameId?: string,
): Promise<LeaderboardRow[]> {
  const scores = await db.gameScore.findMany({
    where: {
      ...periodFilter(period),
      ...(gameId ? { gameId } : {}),
    },
    include: { player: true },
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
  });

  const best = new Map<string, (typeof scores)[number]>();
  for (const row of scores) {
    const key = gameId ? row.playerId : row.playerId;
    const existing = best.get(key);
    if (!existing || row.score > existing.score) best.set(key, row);
  }

  return [...best.values()]
    .sort((a, b) => b.score - a.score || a.createdAt.getTime() - b.createdAt.getTime())
    .map((row, index) => ({
      rank: index + 1,
      displayName: row.player.displayName,
      score: row.score,
      gameId: row.gameId,
      createdAt: row.createdAt,
    }));
}

export async function getLeaderboard(
  db: PrismaClient,
  period: LeaderboardPeriod,
  gameId?: string,
  limit = 20,
) {
  const rows = await bestScores(db, period, gameId);
  return rows.slice(0, limit);
}

export async function getPlayerRank(
  db: PrismaClient,
  displayName: string,
  period: LeaderboardPeriod,
  gameId: string,
  score: number,
) {
  const rows = await bestScores(db, period, gameId);
  const match = rows.find((row) => row.displayName === displayName && row.score >= score);
  return match?.rank ?? rows.filter((row) => row.score > score).length + 1;
}

export async function clearScores(db: PrismaClient, period: LeaderboardPeriod | "all-hard") {
  if (period === "today") {
    await db.gameScore.deleteMany({ where: { createdAt: { gte: startOfToday() } } });
    return;
  }
  await db.gameScore.deleteMany();
}
