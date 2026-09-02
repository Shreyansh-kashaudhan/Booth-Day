# Security Arcade

Local-first booth game for a Bot Protection / API Protection event stand. Players enter a name, spin a wheel, play a short game, and land on a leaderboard.

## Requirements

- Node.js 20+
- npm 10+

## Installation

```bash
npm install
```

## Database setup

```bash
npx prisma migrate dev --name init
```

SQLite file: `prisma/dev.db` (created from `DATABASE_URL` in `.env`).

Copy env if needed:

```bash
cp .env.example .env
```

Default admin password: `arcade` (`ADMIN_PASSWORD`).

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Path | What |
| --- | --- |
| `/` | Attract screen |
| `/play` | Name → wheel → game |
| `/leaderboard` | Today / all-time scores |
| `/booth` | Large-screen mode (F11 / fullscreen) |
| `/admin` | Enable games, clear scores |

## Build / production

```bash
npm run build
npm start
```

## Tests

```bash
npm test
```

## Question bank

Open [http://localhost:3000/admin](http://localhost:3000/admin) and sign in with `ADMIN_PASSWORD` (default `arcade`).

There you can view, add, edit, and delete:

- Word Battle words
- Dingbats (emoji/text, answer, hint, set)
- Perfect 10 target seconds and tries
- Bot or Not scenarios (facts JSON + bot/human)

The first visit copies the bundled sample sets into SQLite. After that, games use the edited list.

## Adding a new game

1. Create `src/games/<id>/<Name>Game.tsx` (the UI).
2. Create `src/games/<id>/<id>.data.ts` (puzzles/words/config).
3. Create `src/games/<id>/<id>.definition.ts` with a `GameDefinition`:
   - `id`, `name`, `description`, `howToPlay`, `icon`, `accent`
   - `enabled`, `weight`, `maxScore`
   - `scoreFromPayload(payload)` — server-side scoring
4. Register the definition in `src/games/registry.ts`.
5. Map the component in `src/games/client-registry.ts`.
6. Run the app.

The wheel, play flow, leaderboard tabs, admin toggles, and score API pick up the new `id` automatically. No schema change.

## Adding content

Edit data files only. Restart the dev server if it does not hot-reload.

### Word Battle words

File: `src/games/wordle/wordle.data.ts`

```ts
{ word: "AGENT", difficulty: "easy", category: "security" },
```

Keep `word` length equal to `WORD_BATTLE_CONFIG.wordLength` (5 unless you change it).

### Dingbats

File: `src/games/dingbats/dingbats.data.ts`

```ts
{
  id: "ap-011",
  set: "api-protection", // or "harness" | "classic"
  difficulty: "easy",
  display: "emoji",
  content: "🗽  ⚡  🌉",
  answer: "LAND SPEED VIOLATION",
  acceptedAnswers: ["IMPOSSIBLE TRAVEL"],
  hint: "Too fast to be one human.",
},
```

A round uses `DINGBATS_CONFIG.activeSets` in `src/games/dingbats/dingbats.data.ts`.

Booth default is team-only:

```ts
activeSets: ["harness"],
```

To mix in threat-type or classic puzzles: `activeSets: ["harness", "api-protection", "classic"]`.

### Bot or Not

File: `src/games/botOrNot/botOrNot.data.ts`

Add another scenario object with `facts`, `answer: "bot" | "human"`, and `explanation`.

### Perfect 10 scoring

Thresholds live in `src/games/perfect10/perfect10.data.ts`, not in the UI.
