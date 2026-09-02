"use client";

import type { GameMeta } from "@/games/types";
import { useState } from "react";

export function AdminPanel({
  games,
  content,
}: {
  games: GameMeta[];
  content: { words: number; dingbats: number; bots: number };
}) {
  const [message, setMessage] = useState("");

  async function toggle(gameId: string, enabled: boolean) {
    await fetch("/api/admin/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, enabled }),
    });
    window.location.reload();
  }

  async function clear(scope: "today" | "all") {
    const ok = window.confirm(
      scope === "all" ? "Delete ALL scores? This cannot be undone." : "Clear today's scores?",
    );
    if (!ok) return;
    await fetch("/api/admin/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope }),
    });
    setMessage(scope === "all" ? "All scores cleared." : "Today's scores cleared.");
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl">Admin</h1>
      {message ? <p className="text-arcade-go">{message}</p> : null}
      <section className="card-panel p-5">
        <h2 className="font-display text-2xl">Games</h2>
        <ul className="mt-4 space-y-3">
          {games.map((game) => (
            <li key={game.id} className="flex items-center justify-between">
              <span>
                {game.icon} {game.name}
              </span>
              <button
                className={`arcade-chip ${game.enabled ? "arcade-chip-on" : ""}`}
                type="button"
                onClick={() => toggle(game.id, !game.enabled)}
              >
                {game.enabled ? "On" : "Off"}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="card-panel p-5">
        <h2 className="font-display text-2xl">Leaderboard</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="arcade-btn arcade-btn-gold px-5 py-2" type="button" onClick={() => clear("today")}>
            Clear today&apos;s scores
          </button>
          <button className="arcade-btn arcade-btn-magenta px-5 py-2" type="button" onClick={() => clear("all")}>
            Clear ALL scores
          </button>
        </div>
      </section>
      <section className="card-panel p-5">
        <h2 className="font-display text-2xl">Loaded content</h2>
        <ul className="mt-3 space-y-1 font-mono">
          <li>Word Battle words: {content.words}</li>
          <li>Dingbat puzzles: {content.dingbats}</li>
          <li>Bot or Not scenarios: {content.bots}</li>
        </ul>
        <p className="mt-3 text-sm text-cream/60">Edit the question bank below. Games use that list, not the original files, once saved.</p>
      </section>
    </div>
  );
}
