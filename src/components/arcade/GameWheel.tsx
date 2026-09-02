"use client";

import type { GameMeta } from "@/games/types";
import { pickWeightedGame } from "@/lib/game-selection";
import { sfx } from "@/lib/sound";
import { useSound } from "@/components/arcade/SoundProvider";
import { useState } from "react";

export function GameWheel({
  games,
  onPicked,
}: {
  games: GameMeta[];
  onPicked: (game: GameMeta) => void;
}) {
  const { muted } = useSound();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<GameMeta | null>(null);

  const slice = 360 / Math.max(games.length, 1);
  const gradient = games
    .map((g, i) => `${g.accent} ${i * slice}deg ${(i + 1) * slice}deg`)
    .join(", ");

  function spin() {
    if (spinning || games.length === 0) return;
    const picked = pickWeightedGame(games);
    const index = games.findIndex((g) => g.id === picked.id);
    const center = index * slice + slice / 2;
    const targetMod = (360 - center) % 360;
    setLanded(null);
    setSpinning(true);
    if (!muted) sfx.spin();
    setRotation((prev) => {
      const normalized = ((prev % 360) + 360) % 360;
      let delta = targetMod - normalized;
      if (delta <= 0) delta += 360;
      return prev + 360 * 6 + delta;
    });
    setTimeout(() => {
      setSpinning(false);
      setLanded(picked);
    }, 4200);
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative h-[320px] w-[320px] sm:h-[420px] sm:w-[420px]">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 text-4xl text-magenta">▼</div>
        <div
          className="absolute inset-6 rounded-full border-8 border-ticket shadow-[0_0_40px_#ffc53d66]"
          style={{
            background: `conic-gradient(${gradient || "#333"})`,
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.12, 0.75, 0.12, 1)" : "none",
          }}
        >
          {games.map((game, i) => {
            const angle = i * slice + slice / 2;
            return (
              <div
                key={game.id}
                className="absolute left-1/2 top-1/2 w-28 -translate-x-1/2 text-center font-display text-sm text-cabinet"
                style={{ transform: `rotate(${angle}deg) translateY(-118px) rotate(${-angle}deg)` }}
              >
                <div className="text-2xl">{game.icon}</div>
                {game.name}
              </div>
            );
          })}
        </div>
      </div>
      {!landed ? (
        <button className="arcade-btn arcade-btn-magenta px-12 py-4 text-2xl" type="button" onClick={spin} disabled={spinning}>
          {spinning ? "Spinning..." : "Spin the wheel"}
        </button>
      ) : (
        <div className="text-center">
          <p className="font-display text-3xl text-ticket">You got… {landed.icon} {landed.name}!</p>
          <button className="arcade-btn arcade-btn-cyan mt-4 px-10 py-3 text-xl" type="button" onClick={() => onPicked(landed)}>
            Play now
          </button>
        </div>
      )}
      <div className={`w-full max-w-2xl text-center ${spinning ? "pointer-events-none opacity-40" : ""}`}>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-cream/50">Or pick a game</p>
        <div className="flex flex-wrap justify-center gap-2">
          {games.map((game) => (
            <button
              key={game.id}
              type="button"
              className="arcade-chip"
              disabled={spinning}
              onClick={() => onPicked(game)}
            >
              {game.icon} {game.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
