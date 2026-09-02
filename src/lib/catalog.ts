import { prisma } from "@/lib/db";
import { WORD_BATTLE_WORDS, type WordBattleEntry } from "@/games/wordle/wordle.data";
import { DINGBAT_PUZZLES, DINGBATS_CONFIG, clampPuzzlesPerRound, type DingbatPuzzle } from "@/games/dingbats/dingbats.data";
import { BOT_OR_NOT_SCENARIOS, type BotOrNotScenario } from "@/games/botOrNot/botOrNot.data";
import { PERFECT10_CONFIG } from "@/games/perfect10/perfect10.data";

export type Catalog = {
  words: Array<WordBattleEntry & { id: string }>;
  dingbats: DingbatPuzzle[];
  dingbatsSettings: { puzzlesPerRound: number };
  bots: BotOrNotScenario[];
  perfect10: { targetSeconds: number; attempts: number };
};

let seeded = false;

function toDingbatRow(p: DingbatPuzzle) {
  return {
    id: p.id,
    set: p.set ?? "classic",
    difficulty: p.difficulty,
    content: p.content,
    answer: p.answer,
    acceptedAnswers: JSON.stringify(p.acceptedAnswers ?? []),
    hint: p.hint ?? "",
    display: p.display ?? "text",
  };
}

export async function seedCatalog() {
  if (seeded) return;
  if ((await prisma.wordItem.count()) === 0) {
    await prisma.wordItem.createMany({
      data: WORD_BATTLE_WORDS.map((w) => ({
        word: w.word.toUpperCase(),
        difficulty: w.difficulty,
        category: w.category,
      })),
    });
  }
  if ((await prisma.dingbatItem.count()) === 0) {
    await prisma.dingbatItem.createMany({
      data: DINGBAT_PUZZLES.map(toDingbatRow),
    });
  }
  if ((await prisma.botItem.count()) === 0) {
    await prisma.botItem.createMany({
      data: BOT_OR_NOT_SCENARIOS.map((s) => ({
        id: s.id,
        title: s.title,
        difficulty: s.difficulty,
        facts: JSON.stringify(s.facts),
        answer: s.answer,
        explanation: s.explanation,
      })),
    });
  }
  if ((await prisma.perfect10Settings.count()) === 0) {
    await prisma.perfect10Settings.create({
      data: {
        id: "default",
        targetSeconds: PERFECT10_CONFIG.targetSeconds,
        attempts: PERFECT10_CONFIG.attempts,
      },
    });
  }
  if ((await prisma.dingbatsSettings.count()) === 0) {
    await prisma.dingbatsSettings.create({
      data: {
        id: "default",
        puzzlesPerRound: DINGBATS_CONFIG.puzzlesPerRound,
      },
    });
  }
  seeded = true;
}

function parseFacts(raw: string): BotOrNotScenario["facts"] {
  try {
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return [];
    return value.filter(
      (row): row is { label: string; value: string } =>
        !!row && typeof row === "object" && typeof row.label === "string" && typeof row.value === "string",
    );
  } catch {
    return [];
  }
}

function parseAccepted(raw: string): string[] {
  try {
    const value = JSON.parse(raw) as unknown;
    return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
  } catch {
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

export async function loadCatalog(): Promise<Catalog> {
  await seedCatalog();
  const [words, dingbats, bots, perfect, dingbatsSettings] = await Promise.all([
    prisma.wordItem.findMany({ orderBy: { word: "asc" } }),
    prisma.dingbatItem.findMany({ orderBy: { set: "asc" } }),
    prisma.botItem.findMany({ orderBy: { title: "asc" } }),
    prisma.perfect10Settings.findUnique({ where: { id: "default" } }),
    prisma.dingbatsSettings.findUnique({ where: { id: "default" } }),
  ]);
  return {
    words: words.map((w) => ({
      id: w.id,
      word: w.word,
      difficulty: w.difficulty as WordBattleEntry["difficulty"],
      category: w.category,
    })),
    dingbats: dingbats.map((p) => ({
      id: p.id,
      set: p.set as DingbatPuzzle["set"],
      difficulty: p.difficulty as DingbatPuzzle["difficulty"],
      content: p.content,
      answer: p.answer,
      acceptedAnswers: parseAccepted(p.acceptedAnswers),
      hint: p.hint || undefined,
      display: (p.display as DingbatPuzzle["display"]) ?? "text",
    })),
    dingbatsSettings: {
      puzzlesPerRound: clampPuzzlesPerRound(dingbatsSettings?.puzzlesPerRound ?? DINGBATS_CONFIG.puzzlesPerRound),
    },
    bots: bots.map((s) => ({
      id: s.id,
      title: s.title,
      difficulty: s.difficulty as BotOrNotScenario["difficulty"],
      facts: parseFacts(s.facts),
      answer: s.answer === "human" ? "human" : "bot",
      explanation: s.explanation,
    })),
    perfect10: {
      targetSeconds: perfect?.targetSeconds ?? PERFECT10_CONFIG.targetSeconds,
      attempts: perfect?.attempts ?? PERFECT10_CONFIG.attempts,
    },
  };
}
