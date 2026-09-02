"use client";

import type { GameMeta } from "@/games/types";
import { ReactNode } from "react";

export function GameShell({
  game,
  playerName,
  children,
  onExit,
}: {
  game: GameMeta;
  playerName: string;
  children: ReactNode;
  onExit: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan">{playerName}</p>
          <h2 className="font-display text-3xl sm:text-4xl">
            {game.icon} {game.name}
          </h2>
        </div>
        <button type="button" className="arcade-icon-btn" onClick={onExit}>
          Exit
        </button>
      </header>
      <div className="card-panel p-4 sm:p-8">{children}</div>
    </div>
  );
}
