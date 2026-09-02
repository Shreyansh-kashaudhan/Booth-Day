"use client";

import { BOT_OR_NOT_CONFIG, BOT_OR_NOT_SCENARIOS, type BotOrNotScenario } from "@/games/botOrNot/botOrNot.data";
import type { GameComponentProps } from "@/games/types";
import { sfx } from "@/lib/sound";
import { useSound } from "@/components/arcade/SoundProvider";
import { useCatalog } from "@/components/arcade/useCatalog";
import { useEffect, useState } from "react";

function pick(count: number, pool: BotOrNotScenario[]): BotOrNotScenario[] {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

export function BotOrNotGame({ onComplete }: GameComponentProps) {
  const { muted } = useSound();
  const catalog = useCatalog();
  const [rounds, setRounds] = useState<BotOrNotScenario[] | null>(null);
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<{ id: string; choice: "bot" | "human" }[]>([]);
  const [reveal, setReveal] = useState<"bot" | "human" | null>(null);

  useEffect(() => {
    if (!catalog || rounds) return;
    const pool = catalog.bots.length ? catalog.bots : BOT_OR_NOT_SCENARIOS;
    setRounds(pick(BOT_OR_NOT_CONFIG.rounds, pool));
  }, [catalog, rounds]);

  if (!rounds) {
    return <p className="text-center font-mono uppercase tracking-widest text-cream/60">Loading…</p>;
  }

  const round = rounds;
  const scenario = round[index];
  const correct = reveal ? reveal === scenario.answer : null;

  function choose(choice: "bot" | "human") {
    if (reveal) return;
    setReveal(choice);
    const ok = choice === scenario.answer;
    if (!muted) (ok ? sfx.correct : sfx.wrong)();
    const next = [...choices, { id: scenario.id, choice }];
    setTimeout(() => {
      if (index + 1 >= round.length) onComplete({ choices: next });
      else {
        setChoices(next);
        setIndex(index + 1);
        setReveal(null);
      }
    }, 1100);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <p className="text-center font-mono text-sm uppercase tracking-[0.3em] text-cream/60">
        Request {index + 1} / {round.length}
      </p>
      <div className="card-panel p-6">
        <h3 className="font-display text-2xl text-ticket">{scenario.title}</h3>
        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          {scenario.facts.map((fact) => (
            <div key={fact.label} className="rounded-lg bg-black/30 px-3 py-2">
              <dt className="font-mono text-xs uppercase tracking-widest text-cyan">{fact.label}</dt>
              <dd className="text-lg text-cream">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {reveal ? (
        <div className={`text-center font-display text-2xl ${correct ? "text-arcade-go" : "text-magenta"}`}>
          {correct ? "Correct!" : "Nope!"} {scenario.answer === "bot" ? "BOT DETECTED" : "HUMAN"}
          <p className="mt-2 font-sans text-base font-normal text-cream/80">{scenario.explanation}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <button className="arcade-btn arcade-btn-magenta py-6 text-2xl" type="button" onClick={() => choose("bot")}>
            🤖 Bot
          </button>
          <button className="arcade-btn arcade-btn-cyan py-6 text-2xl" type="button" onClick={() => choose("human")}>
            👤 Human
          </button>
        </div>
      )}
    </div>
  );
}
