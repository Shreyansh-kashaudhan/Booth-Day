"use client";

import { PlayFlow } from "@/components/arcade/PlayFlow";
import type { GameMeta } from "@/games/types";
import { useEffect, useState } from "react";

export function BoothExperience({ games }: { games: GameMeta[] }) {
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F11") setHint(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function fullscreen() {
    await document.documentElement.requestFullscreen?.();
    setHint(false);
  }

  return (
    <div className="mx-auto max-w-6xl pt-2">
      {hint ? (
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <p className="font-mono uppercase tracking-[0.3em] text-cream/70">Large screen mode — press F11 or</p>
          <button className="arcade-btn arcade-btn-gold px-6 py-2" type="button" onClick={fullscreen}>
            Go fullscreen
          </button>
        </div>
      ) : null}
      <PlayFlow games={games} booth />
    </div>
  );
}
