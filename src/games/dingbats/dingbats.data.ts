export type DingbatSet = "classic" | "harness" | "api-protection";

export interface DingbatPuzzle {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  set?: DingbatSet;
  content: string;
  answer: string;
  acceptedAnswers?: string[];
  hint?: string;
  display?: "text" | "emoji";
}

export const DINGBAT_SET_LABEL: Record<DingbatSet, string> = {
  classic: "Classic",
  harness: "Harness",
  "api-protection": "API Protection",
};

export const DINGBATS_CONFIG = {
  puzzlesPerRound: 3,
  guessesPerPuzzle: 3,
  timeLimitSeconds: 60,
  correctScore: 34,
  hintPenalty: 10,
  activeSets: ["harness", "api-protection"] as DingbatSet[],
};

export function clampPuzzlesPerRound(value: unknown): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return DINGBATS_CONFIG.puzzlesPerRound;
  return Math.min(50, Math.max(1, n));
}

function puzzleSet(puzzle: DingbatPuzzle): DingbatSet {
  return puzzle.set ?? "classic";
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickPuzzles(
  count: number,
  all: DingbatPuzzle[] = DINGBAT_PUZZLES,
  sets: DingbatSet[] = DINGBATS_CONFIG.activeSets,
): DingbatPuzzle[] {
  const want = Math.max(0, Math.floor(count));
  if (want === 0) return [];
  const allowed = sets.length ? sets : DINGBATS_CONFIG.activeSets;
  const pool = all.filter((p) => allowed.includes(puzzleSet(p)));
  const source = pool.length ? pool : all;
  if (!source.length) return [];

  const chosen: DingbatPuzzle[] = [];
  const used = new Set<string>();
  if (allowed.length > 1) {
    for (const set of allowed) {
      if (chosen.length >= want) break;
      const fromSet = shuffle(source.filter((p) => puzzleSet(p) === set && !used.has(p.id)));
      if (fromSet[0]) {
        chosen.push(fromSet[0]);
        used.add(fromSet[0].id);
      }
    }
  }

  let rest = shuffle(source.filter((p) => !used.has(p.id)));
  while (chosen.length < want && rest.length) {
    const next = rest.pop()!;
    chosen.push(next);
    used.add(next.id);
  }

  while (chosen.length < want) {
    rest = shuffle(source);
    const room = want - chosen.length;
    chosen.push(...rest.slice(0, room));
  }
  return shuffle(chosen);
}

export const DINGBAT_PUZZLES: DingbatPuzzle[] = [
  {
    id: "cmtk8rhh00003lewlr8vlnaro",
    set: "harness",
    difficulty: "easy",
    display: "emoji",
    content: "(3.1415....)  🅿️  ⎯",
    answer: "Pipeline",
    acceptedAnswers: ["pipe line"],
    hint: "pii",
  },
  {
    id: "hn-001",
    set: "harness",
    difficulty: "easy",
    display: "emoji",
    content: "👉\n🚢\n✅",
    answer: "GET SHIP DONE",
    acceptedAnswers: ["GET SHIPPED DONE", "GSD"],
    hint: "One emoji per word. Harness motto.",
  },
  {
    id: "hn-002",
    set: "harness",
    difficulty: "easy",
    display: "emoji",
    content: "🏃\n⏰\n🛡️",
    answer: "RUNTIME PROTECTION",
    acceptedAnswers: ["RUN TIME PROTECTION", "RUNTIME"],
    hint: "Run + time + protection.",
  },
  {
    id: "hn-003",
    set: "harness",
    difficulty: "easy",
    display: "emoji",
    content: "🦶URE\n🚩",
    answer: "FEATURE FLAGS",
    acceptedAnswers: ["FEATURE FLAG", "FEATURE TOGGLES", "FEATURE TOGGLE"],
    hint: "Feature + flags.",
  },
  {
    id: "hn-007",
    set: "harness",
    difficulty: "easy",
    display: "emoji",
    content: "🥧  🅿️  ⎯",
    answer: "PIPELINE",
    acceptedAnswers: ["PIPE LINE", "CI PIPELINE", "CD PIPELINE"],
    hint: "Pie + P ",
  },
  {
    id: "hn-008",
    set: "harness",
    difficulty: "easy",
    display: "emoji",
    content: "🇩  ⏯️  🌿",
    answer: "DEPLOYMENT",
    acceptedAnswers: ["DEPLOY", "D PLAY MINT"],
    hint: " D + Play + Mint.",
  },
  {
    id: "ap-001",
    set: "api-protection",
    difficulty: "medium",
    display: "emoji",
    content: "🛬\n🏎️\n🚫",
    answer: "LAND SPEED VIOLATION",
    acceptedAnswers: ["LANDSPEED VIOLATION", "IMPOSSIBLE TRAVEL"],
    hint: "Land + speed + violation.",
  },
  {
    id: "ap-002",
    set: "api-protection",
    difficulty: "easy",
    display: "emoji",
    content: "🪪\n🦃",
    answer: "CREDENTIAL STUFFING",
    acceptedAnswers: ["CRED STUFFING"],
    hint: "Credential + stuffing.",
  },
  {
    id: "ap-003",
    set: "api-protection",
    difficulty: "easy",
    display: "emoji",
    content: "👤\n🎬\n⬆️",
    answer: "ACCOUNT TAKEOVER",
    acceptedAnswers: ["ATO", "ACCOUNT TAKE OVER"],
    hint: "Account + take + over.",
  },
  {
    id: "ap-005",
    set: "api-protection",
    difficulty: "easy",
    display: "emoji",
    content: "🦶 🥫  🔁",
    answer: "TOKEN REPLAY",
    acceptedAnswers: ["REPLAY ATTACK", "SESSION REPLAY"],
    hint: "Token + replay.",
  },
  {
    id: "ap-008",
    set: "api-protection",
    difficulty: "easy",
    display: "emoji",
    content: "🤖\n🛡️",
    answer: "BOT PROTECTION",
    acceptedAnswers: ["BOT DEFENSE", "BOT MITIGATION"],
    hint: "Bot + protection.",
  },
  {
    id: "ap-011",
    set: "api-protection",
    difficulty: "easy",
    display: "emoji",
    content: "🐀\n🛑",
    answer: "RATE LIMITING",
    acceptedAnswers: ["RATE LIMIT", "RATELIMITING", "RAT LIMITING"],
    hint: "Rat + Limiting",
  },
  {
    id: "ap-012",
    set: "api-protection",
    difficulty: "easy",
    display: "emoji",
    content: "🐿️\n💉",
    answer: "SQL INJECTION",
    acceptedAnswers: ["SQLI", "SQL INJECT"],
    hint: "SQuirreL",
  },
  {
    id: "ap-013",
    set: "api-protection",
    difficulty: "medium",
    display: "emoji",
    content: "❌\n👁️\n📜(.sh)",
    answer: "CROSS SITE SCRIPTING",
    acceptedAnswers: ["XSS", "CROSS-SITE SCRIPTING", "CROSS SITE SCRIPT"],
    hint: "Type of threat. Cross + Sight + Scripting.",
  },
  {
    id: "cmtk2f0ga0006leijcmt3cpcl",
    set: "api-protection",
    difficulty: "easy",
    display: "emoji",
    content: "🧍 🧍‍♂️  🧍\n⬆️",
    answer: "Man in the middle",
    acceptedAnswers: ["Man in middle"],
    hint: "Which man is it pointing. Type of attack",
  },
  {
    id: "db-004",
    set: "classic",
    difficulty: "easy",
    display: "text",
    content: "STAND\nI",
    answer: "I UNDERSTAND",
    acceptedAnswers: ["UNDERSTAND"],
    hint: "I is under STAND.",
  },
  {
    id: "db-005",
    set: "classic",
    difficulty: "easy",
    display: "text",
    content: "MIND\n\nMATTER",
    answer: "MIND OVER MATTER",
    hint: "A saying about willpower.",
  },
  {
    id: "db-007",
    set: "classic",
    difficulty: "easy",
    display: "text",
    content: "WEAR\nLONG",
    answer: "LONG UNDERWEAR",
    acceptedAnswers: ["LONG UNDER WEAR"],
    hint: "Winter clothes.",
  },
  {
    id: "db-014",
    set: "classic",
    difficulty: "easy",
    display: "text",
    content: "T\nO\nW\nN",
    answer: "DOWNTOWN",
    hint: "Direction + town.",
  },
  {
    id: "db-028",
    set: "classic",
    difficulty: "easy",
    display: "text",
    content: "TRAVEL\n🌊🌊🌊🌊",
    answer: "TRAVEL OVERSEAS",
    acceptedAnswers: ["TRAVEL OVER SEAS", "OVERSEAS TRAVEL"],
    hint: "The waves are seas.",
  },
  {
    id: "db-029",
    set: "classic",
    difficulty: "medium",
    display: "text",
    content: "++++ ROAD ++++",
    answer: "CROSSROADS",
    acceptedAnswers: ["CROSS ROADS"],
    hint: "The pluses cross it.",
  },
];
