import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { loadCatalog, seedCatalog } from "@/lib/catalog";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await loadCatalog());
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await seedCatalog();
  const body = await request.json();
  const kind = body.kind as string;

  try {
    if (kind === "word") {
      const word = String(body.word ?? "").toUpperCase().replace(/[^A-Z]/g, "");
      if (word.length < 3) return NextResponse.json({ error: "Word is too short" }, { status: 400 });
      await prisma.wordItem.create({
        data: {
          word,
          difficulty: body.difficulty || "easy",
          category: body.category || "security",
        },
      });
    } else if (kind === "dingbat") {
      await prisma.dingbatItem.create({
        data: {
          set: body.set || "harness",
          difficulty: body.difficulty || "easy",
          content: String(body.content ?? "").trim(),
          answer: String(body.answer ?? "").trim(),
          acceptedAnswers: JSON.stringify(splitList(body.acceptedAnswers)),
          hint: String(body.hint ?? ""),
          display: body.display || "emoji",
        },
      });
    } else if (kind === "bot") {
      await prisma.botItem.create({
        data: {
          title: String(body.title ?? "Untitled"),
          difficulty: body.difficulty || "easy",
          facts: stringifyFacts(body.facts),
          answer: body.answer === "human" ? "human" : "bot",
          explanation: String(body.explanation ?? ""),
        },
      });
    } else if (kind === "perfect10") {
      await prisma.perfect10Settings.upsert({
        where: { id: "default" },
        create: {
          id: "default",
          targetSeconds: Number(body.targetSeconds) || 10,
          attempts: Number(body.attempts) || 3,
        },
        update: {
          targetSeconds: Number(body.targetSeconds) || 10,
          attempts: Number(body.attempts) || 3,
        },
      });
    } else {
      return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
    }
    return NextResponse.json(await loadCatalog());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Save failed" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const kind = body.kind as string;
  const id = String(body.id ?? "");
  try {
    if (kind === "word") {
      await prisma.wordItem.update({
        where: { id },
        data: {
          word: String(body.word ?? "").toUpperCase().replace(/[^A-Z]/g, ""),
          difficulty: body.difficulty || "easy",
          category: body.category || "security",
        },
      });
    } else if (kind === "dingbat") {
      await prisma.dingbatItem.update({
        where: { id },
        data: {
          set: body.set || "harness",
          difficulty: body.difficulty || "easy",
          content: String(body.content ?? "").trim(),
          answer: String(body.answer ?? "").trim(),
          acceptedAnswers: JSON.stringify(splitList(body.acceptedAnswers)),
          hint: String(body.hint ?? ""),
          display: body.display || "emoji",
        },
      });
    } else if (kind === "bot") {
      await prisma.botItem.update({
        where: { id },
        data: {
          title: String(body.title ?? "Untitled"),
          difficulty: body.difficulty || "easy",
          facts: stringifyFacts(body.facts),
          answer: body.answer === "human" ? "human" : "bot",
          explanation: String(body.explanation ?? ""),
        },
      });
    } else {
      return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
    }
    return NextResponse.json(await loadCatalog());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Update failed" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const kind = body.kind as string;
  const id = String(body.id ?? "");
  if (kind === "word") await prisma.wordItem.delete({ where: { id } });
  else if (kind === "dingbat") await prisma.dingbatItem.delete({ where: { id } });
  else if (kind === "bot") await prisma.botItem.delete({ where: { id } });
  else return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
  return NextResponse.json(await loadCatalog());
}

function splitList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  const trimmed = value.trim();
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
}

function stringifyFacts(value: unknown): string {
  if (typeof value === "string") {
    JSON.parse(value);
    return value;
  }
  return JSON.stringify(value ?? []);
}
