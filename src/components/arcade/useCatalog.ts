"use client";

import { useEffect, useState } from "react";
import type { Catalog } from "@/lib/catalog";
import { WORD_BATTLE_WORDS } from "@/games/wordle/wordle.data";
import { DINGBAT_PUZZLES, DINGBATS_CONFIG } from "@/games/dingbats/dingbats.data";
import { BOT_OR_NOT_SCENARIOS } from "@/games/botOrNot/botOrNot.data";
import { PERFECT10_CONFIG } from "@/games/perfect10/perfect10.data";

export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Catalog) => setCatalog(data))
      .catch(() =>
        setCatalog({
          words: WORD_BATTLE_WORDS.map((w, i) => ({ ...w, id: String(i) })),
          dingbats: DINGBAT_PUZZLES,
          dingbatsSettings: { puzzlesPerRound: DINGBATS_CONFIG.puzzlesPerRound },
          bots: BOT_OR_NOT_SCENARIOS,
          perfect10: { targetSeconds: PERFECT10_CONFIG.targetSeconds, attempts: PERFECT10_CONFIG.attempts },
        }),
      );
  }, []);

  return catalog;
}
