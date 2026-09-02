import { NextResponse } from "next/server";
import { listGameMeta, getEnabledGames } from "@/games/registry";
import { toGameMeta } from "@/games/types";
import { prisma } from "@/lib/db";

export async function GET() {
  const toggles = await prisma.gameToggle.findMany();
  const map = Object.fromEntries(toggles.map((t) => [t.gameId, t.enabled]));
  const enabled = getEnabledGames(map).map(toGameMeta);
  return NextResponse.json({ games: enabled, all: listGameMeta() });
}
