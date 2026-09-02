import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { getGame } from "@/games/registry";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const game = getGame(body.gameId);
  if (!game) return NextResponse.json({ error: "Unknown game" }, { status: 400 });
  await prisma.gameToggle.upsert({
    where: { gameId: game.id },
    create: { gameId: game.id, enabled: Boolean(body.enabled) },
    update: { enabled: Boolean(body.enabled) },
  });
  return NextResponse.json({ ok: true });
}
