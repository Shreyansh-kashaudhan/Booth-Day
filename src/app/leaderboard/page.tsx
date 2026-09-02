import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { prisma } from "@/lib/db";
import { getLeaderboard } from "@/lib/leaderboard";
import { listGameMeta } from "@/games/registry";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const games = listGameMeta();
  const [today, allTime, ...perGame] = await Promise.all([
    getLeaderboard(prisma, "today"),
    getLeaderboard(prisma, "all"),
    ...games.flatMap((game) => [getLeaderboard(prisma, "today", game.id), getLeaderboard(prisma, "all", game.id)]),
  ]);

  const byGame: Record<string, { today: typeof today; allTime: typeof allTime }> = {};
  games.forEach((game, i) => {
    byGame[game.id] = { today: perGame[i * 2], allTime: perGame[i * 2 + 1] };
  });

  return (
    <div className="mx-auto max-w-3xl pt-4">
      <h1 className="mb-6 text-center font-display text-5xl text-ticket">Top Players</h1>
      <Leaderboard games={games} overall={{ today, allTime }} byGame={byGame} />
    </div>
  );
}
