import { NextResponse } from "next/server";
import { getEnabledGames, getGame } from "@/games/registry";
import { prisma } from "@/lib/db";
import { getPlayerRank, submitScore } from "@/lib/leaderboard";
import { sanitizeDisplayName } from "@/lib/sanitize";
import { loadCatalog } from "@/lib/catalog";
import { scoreWordBattle } from "@/games/wordle/wordle.definition";
import { scoreDingbats } from "@/games/dingbats/dingbats.definition";
import { scoreBotOrNot } from "@/games/botOrNot/botOrNot.definition";
import { scorePerfect10Payload } from "@/games/perfect10/perfect10.definition";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const displayName = sanitizeDisplayName(body.displayName);
    if (!displayName) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    const game = getGame(body.gameId);
    if (!game) {
      return NextResponse.json({ error: "Unknown game" }, { status: 400 });
    }

    const toggles = await prisma.gameToggle.findMany();
    const map = Object.fromEntries(toggles.map((t) => [t.gameId, t.enabled]));
    if (!getEnabledGames(map).some((g) => g.id === game.id)) {
      return NextResponse.json({ error: "Game disabled" }, { status: 400 });
    }

    const catalog = await loadCatalog();
    const scored =
      game.id === "wordle"
        ? scoreWordBattle(body.payload, catalog.words)
        : game.id === "dingbats"
          ? scoreDingbats(body.payload, catalog.dingbats)
          : game.id === "botOrNot"
            ? scoreBotOrNot(body.payload, catalog.bots)
            : game.id === "perfect10"
              ? scorePerfect10Payload(body.payload, catalog.perfect10)
              : game.scoreFromPayload(body.payload);
    if ("error" in scored) {
      return NextResponse.json({ error: scored.error }, { status: 400 });
    }

    try {
      await submitScore(prisma, {
        displayName,
        gameId: game.id,
        score: scored.score,
        maxScore: scored.maxScore,
        metadata: scored.stats,
      });
      const rankToday = await getPlayerRank(prisma, displayName, "today", game.id, scored.score);
      return NextResponse.json({ ...scored, rankToday, leaderboardError: false });
    } catch {
      return NextResponse.json({ ...scored, leaderboardError: true });
    }
  } catch {
    return NextResponse.json({ error: "Could not score game" }, { status: 500 });
  }
}
