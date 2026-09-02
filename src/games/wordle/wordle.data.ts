export type WordBattleEntry = {
  word: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
};

export const WORD_BATTLE_CONFIG = {
  wordLength: 5,
  attempts: 6,
  timeLimitSeconds: 90,
  winScoresByAttempt: [100, 90, 80, 70, 60, 50],
  loseScore: 0,
};

export const WORD_BATTLE_WORDS: WordBattleEntry[] = [
  { word: "BLOCK", difficulty: "easy", category: "security" },
  { word: "TOKEN", difficulty: "easy", category: "security" },
  { word: "LOGIN", difficulty: "easy", category: "security" },
  { word: "PROXY", difficulty: "medium", category: "security" },
  { word: "HUMAN", difficulty: "easy", category: "security" },
  { word: "ROBOT", difficulty: "easy", category: "bots" },
  { word: "FRAUD", difficulty: "easy", category: "security" },
  { word: "GUARD", difficulty: "easy", category: "security" },
  { word: "AGENT", difficulty: "easy", category: "security" },
  { word: "QUEUE", difficulty: "medium", category: "systems" },
  { word: "CHECK", difficulty: "easy", category: "security" },
  { word: "CLOUD", difficulty: "easy", category: "systems" },
  { word: "TRACE", difficulty: "medium", category: "systems" },
  { word: "BADGE", difficulty: "easy", category: "security" },
  { word: "VAULT", difficulty: "easy", category: "security" },
  { word: "CATCH", difficulty: "easy", category: "bots" },
  { word: "ALERT", difficulty: "easy", category: "security" },
  { word: "TRUST", difficulty: "easy", category: "security" },
  { word: "PATCH", difficulty: "easy", category: "security" },
  { word: "CLICK", difficulty: "easy", category: "web" },
  { word: "FETCH", difficulty: "medium", category: "web" },
  { word: "QUERY", difficulty: "medium", category: "web" },
  { word: "GRAPH", difficulty: "medium", category: "web" },
  { word: "CACHE", difficulty: "medium", category: "systems" },
  { word: "BYTES", difficulty: "medium", category: "systems" },
  { word: "FRAME", difficulty: "medium", category: "web" },
  { word: "SPIKE", difficulty: "medium", category: "bots" },
  { word: "FLOOD", difficulty: "easy", category: "bots" },
  { word: "BURST", difficulty: "medium", category: "bots" },
  { word: "BRUTE", difficulty: "medium", category: "security" },
];

export function randomWord(): WordBattleEntry {
  const pool = WORD_BATTLE_WORDS.filter((w) => w.word.length === WORD_BATTLE_CONFIG.wordLength);
  return pool[Math.floor(Math.random() * pool.length)];
}
