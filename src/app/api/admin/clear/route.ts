import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { clearScores } from "@/lib/leaderboard";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (body.scope !== "today" && body.scope !== "all") {
    return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
  }
  await clearScores(prisma, body.scope === "today" ? "today" : "all-hard");
  return NextResponse.json({ ok: true });
}
