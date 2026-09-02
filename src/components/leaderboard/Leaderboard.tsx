"use client";

import type { LeaderboardRow } from "@/lib/leaderboard";
import type { GameMeta } from "@/games/types";
import { useState } from "react";

type Board = { today: LeaderboardRow[]; allTime: LeaderboardRow[] };

export function Leaderboard({
  games,
  overall,
  byGame,
}: {
  games: GameMeta[];
  overall: Board;
  byGame: Record<string, Board>;
}) {
  const [period, setPeriod] = useState<"today" | "allTime">("today");
  const [gameId, setGameId] = useState("all");
  const board = gameId === "all" ? overall : byGame[gameId];
  const rows = board?.[period] ?? [];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {(["today", "allTime"] as const).map((p) => (
          <button
            key={p}
            type="button"
            className={`arcade-chip ${period === p ? "arcade-chip-on" : ""}`}
            onClick={() => setPeriod(p)}
          >
            {p === "today" ? "Today" : "All time"}
          </button>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button type="button" className={`arcade-chip ${gameId === "all" ? "arcade-chip-on" : ""}`} onClick={() => setGameId("all")}>
          Top players
        </button>
        {games.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`arcade-chip ${gameId === g.id ? "arcade-chip-on" : ""}`}
            onClick={() => setGameId(g.id)}
          >
            {g.icon} {g.name}
          </button>
        ))}
      </div>
      <ol className="card-panel divide-y divide-white/10">
        {rows.length === 0 ? (
          <li className="p-8 text-center text-cream/60">No scores yet. Spin the wheel.</li>
        ) : (
          rows.map((row) => (
            <li key={`${row.displayName}-${row.gameId}-${row.rank}`} className="flex items-center justify-between px-5 py-4">
              <span className="font-display text-2xl text-ticket">#{row.rank}</span>
              <span className="flex-1 px-4 text-xl">{row.displayName}</span>
              <span className="font-mono text-2xl text-cyan">{row.score}</span>
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
