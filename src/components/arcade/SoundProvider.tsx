"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SoundCtx = { muted: boolean; toggle: () => void };

const Ctx = createContext<SoundCtx>({ muted: true, toggle: () => {} });

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);

  function toggle() {
    setMuted((m) => !m);
  }

  return <Ctx.Provider value={{ muted, toggle }}>{children}</Ctx.Provider>;
}

export function useSound() {
  return useContext(Ctx);
}

export function SoundToggle() {
  const { muted, toggle } = useSound();
  return (
    <button type="button" onClick={toggle} className="arcade-icon-btn" aria-label={muted ? "Unmute" : "Mute"}>
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
