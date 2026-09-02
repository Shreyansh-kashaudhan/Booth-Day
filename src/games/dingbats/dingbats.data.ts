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
  { id: "db-001", difficulty: "easy", content: "MAN\n\nBOARD", answer: "MAN OVERBOARD", acceptedAnswers: ["MAN OVER BOARD"], hint: "A sailor went where?" },
  { id: "db-002", difficulty: "easy", content: "CYCLE\nCYCLE\nCYCLE", answer: "TRICYCLE", hint: "Count the cycles." },
  { id: "db-003", difficulty: "easy", content: "CYCLE\nCYCLE", answer: "BICYCLE", hint: "Two of them." },
  { id: "db-004", difficulty: "easy", content: "STAND\nI", answer: "I UNDERSTAND", acceptedAnswers: ["UNDERSTAND"], hint: "I is under STAND." },
  { id: "db-005", difficulty: "easy", content: "MIND\n\nMATTER", answer: "MIND OVER MATTER", hint: "A saying about willpower." },
  { id: "db-006", difficulty: "easy", content: "HEAD\n\nHEELS", answer: "HEAD OVER HEELS", hint: "A feeling." },
  { id: "db-007", difficulty: "easy", content: "WEAR\nLONG", answer: "LONG UNDERWEAR", acceptedAnswers: ["LONG UNDER WEAR"], hint: "Winter clothes." },
  { id: "db-008", difficulty: "easy", content: "TIME\nTIME", answer: "TIME AFTER TIME", hint: "Again and again." },
  { id: "db-009", difficulty: "easy", content: "ONCE\nA\nTIME", answer: "ONCE UPON A TIME", hint: "How stories start." },
  { id: "db-010", difficulty: "medium", content: "EGG\nEASY", answer: "EGGS OVER EASY", acceptedAnswers: ["EGG OVER EASY"], hint: "Breakfast." },
  { id: "db-011", difficulty: "easy", content: "TOUCH\n⬇️", answer: "TOUCHDOWN", hint: "Football score." },
  { id: "db-012", difficulty: "medium", content: "DEATH\nLIFE", answer: "LIFE AFTER DEATH", hint: "Order of the words." },
  { id: "db-013", difficulty: "medium", content: "R\nE\nA\nD\nI\nN\nG", answer: "READING BETWEEN THE LINES", acceptedAnswers: ["READ BETWEEN THE LINES"], hint: "Look between the letters." },
  { id: "db-014", difficulty: "easy", content: "T\nO\nW\nN", answer: "DOWNTOWN", hint: "Direction + town." },
  { id: "db-015", difficulty: "medium", content: "LE     VEL", answer: "SPLIT LEVEL", acceptedAnswers: ["SPLITLEVEL"], hint: "A kind of house." },
  { id: "db-016", difficulty: "easy", content: "GOOD\nNOON", answer: "GOOD AFTERNOON", hint: "A greeting." },
  { id: "db-017", difficulty: "medium", content: "GROUND\nFEET  FEET  FEET", answer: "THREE FEET UNDERGROUND", acceptedAnswers: ["3 FEET UNDERGROUND"], hint: "Count the feet." },
  { id: "db-018", difficulty: "easy", content: "JACK\nJACK\nJACK\n📦", answer: "JACK IN THE BOX", acceptedAnswers: ["JACK IN A BOX"], hint: "A toy." },
  { id: "db-019", difficulty: "medium", content: "BELT\nHITTING", answer: "HITTING BELOW THE BELT", hint: "Unfair fight." },
  { id: "db-020", difficulty: "easy", content: "SEARCH\nand\n🔍", answer: "SEARCH AROUND", acceptedAnswers: ["LOOK AROUND"], hint: "The magnifier wraps it." },
  { id: "db-021", difficulty: "easy", content: "FRIENDS\n○", answer: "CIRCLE OF FRIENDS", hint: "The shape." },
  { id: "db-022", difficulty: "medium", content: "JUST\nICE", answer: "JUSTICE", hint: "Put the lines together." },
  { id: "db-023", difficulty: "easy", content: "THE BLAME  THE BLAME", answer: "DOUBLE BLAME", acceptedAnswers: ["BLAME BLAME", "TWO BLAMES"], hint: "How many?" },
  { id: "db-024", difficulty: "medium", content: "somewhere\nOVER\n🌈", answer: "SOMEWHERE OVER THE RAINBOW", hint: "A song." },
  { id: "db-025", difficulty: "easy", content: "STEP\nSTEP\nSTEP", answer: "STEPS", acceptedAnswers: ["STAIRS", "THREE STEPS"], hint: "Plural." },
  { id: "db-026", difficulty: "medium", content: "KNEE\n💡", answer: "NEON LIGHT", acceptedAnswers: ["NEON"], hint: "Say KNEE + ON." },
  { id: "db-027", difficulty: "easy", content: "BLOW\nBLOW", answer: "BLOW BY BLOW", hint: "A detailed account." },
  { id: "db-028", difficulty: "easy", content: "TRAVEL\n~~~~ ~~~~", answer: "TRAVEL OVERSEAS", acceptedAnswers: ["TRAVEL OVER SEAS", "OVERSEAS TRAVEL"], hint: "The waves are seas." },
  { id: "db-029", difficulty: "medium", content: "++++ ROAD ++++", answer: "CROSSROADS", acceptedAnswers: ["CROSS ROADS"], hint: "The pluses cross it." },
  { id: "db-030", difficulty: "easy", content: "i i i i\nGOING", answer: "GOING THROUGH A PERIOD", acceptedAnswers: ["GOING THROUGH PERIODS"], hint: "The dots are periods." },
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
    content: "✨\n🚩",
    answer: "FEATURE FLAGS",
    acceptedAnswers: ["FEATURE FLAG", "FEATURE TOGGLES", "FEATURE TOGGLE"],
    hint: "Feature + flags.",
  },
  {
    id: "hn-004",
    set: "harness",
    difficulty: "easy",
    display: "emoji",
    content: "🔁\n🚚",
    answer: "CONTINUOUS DELIVERY",
    acceptedAnswers: ["CD", "CONTINUOUS DEPLOYMENT"],
    hint: "Continuous + delivery.",
  },
  {
    id: "hn-005",
    set: "harness",
    difficulty: "medium",
    display: "emoji",
    content: "🌪️\n👷",
    answer: "CHAOS ENGINEERING",
    acceptedAnswers: ["CHAOS", "CHAOS ENGINEER"],
    hint: "Chaos + engineering.",
  },
  {
    id: "hn-006",
    set: "harness",
    difficulty: "easy",
    display: "emoji",
    content: "💻\n🚰",
    answer: "CODE PIPELINE",
    acceptedAnswers: ["PIPELINE", "CI PIPELINE", "CD PIPELINE"],
    hint: "Code + pipeline.",
  },
  {
    id: "hn-007",
    set: "harness",
    difficulty: "easy",
    display: "emoji",
    content: "🥧  🅿️  ⎯",
    answer: "PIPELINE",
    acceptedAnswers: ["PIPE LINE", "CI PIPELINE", "CD PIPELINE"],
    hint: "Pie + P + line.",
  },
  {
    id: "hn-008",
    set: "harness",
    difficulty: "easy",
    display: "emoji",
    content: "🇩  ⏯️  🌿",
    answer: "DEPLOYMENT",
    acceptedAnswers: ["DEPLOY", "D PLAY MINT"],
    hint: "The 4th letter of the alphabet, a media button, and an herb. D + Play + Mint.",
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
    content: "👤\n✊\n⬆️",
    answer: "ACCOUNT TAKEOVER",
    acceptedAnswers: ["ATO", "ACCOUNT TAKE OVER"],
    hint: "Account + take + over.",
  },
  {
    id: "ap-004",
    set: "api-protection",
    difficulty: "easy",
    display: "emoji",
    content: "👻\n🔌",
    answer: "SHADOW API",
    acceptedAnswers: ["SHADOW APIS", "UNDOCUMENTED API"],
    hint: "Shadow + API.",
  },
  {
    id: "ap-005",
    set: "api-protection",
    difficulty: "easy",
    display: "emoji",
    content: "🎫\n🔁",
    answer: "TOKEN REPLAY",
    acceptedAnswers: ["REPLAY ATTACK", "SESSION REPLAY"],
    hint: "Token + replay.",
  },
  {
    id: "ap-006",
    set: "api-protection",
    difficulty: "easy",
    display: "emoji",
    content: "🦍\n💪",
    answer: "BRUTE FORCE",
    acceptedAnswers: ["BRUTEFORCE", "PASSWORD GUESSING"],
    hint: "Brute + force.",
  },
  {
    id: "ap-007",
    set: "api-protection",
    difficulty: "easy",
    display: "emoji",
    content: "🔌\n🌊",
    answer: "API FLOOD",
    acceptedAnswers: ["FLOOD", "DDOS", "LAYER 7 DDOS"],
    hint: "API + flood.",
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
    id: "ap-009",
    set: "api-protection",
    difficulty: "easy",
    display: "emoji",
    content: "💳\n🧪",
    answer: "CARD TESTING",
    acceptedAnswers: ["CARDING", "PAYMENT FRAUD"],
    hint: "Card + testing.",
  },
  {
    id: "ap-010",
    set: "api-protection",
    difficulty: "medium",
    display: "emoji",
    content: "🧹\n📊",
    answer: "DATA SCRAPING",
    acceptedAnswers: ["SCRAPING", "SCRAPER", "API SCRAPING"],
    hint: "Data + scraping.",
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
    hint: "SQuirreL + Injection",
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
];
