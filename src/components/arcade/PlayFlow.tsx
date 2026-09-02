"use client";

import { GAME_COMPONENTS } from "@/games/client-registry";
import type { GameMeta } from "@/games/types";
import { GameShell } from "@/components/arcade/GameShell";
import { GameWheel } from "@/components/arcade/GameWheel";
import { sfx } from "@/lib/sound";
import { useSound } from "@/components/arcade/SoundProvider";
import Link from "next/link";
import { useState } from "react";

type Step = "name" | "wheel" | "howto" | "play" | "result";

export function PlayFlow({ games, booth = false }: { games: GameMeta[]; booth?: boolean }) {
  const { muted } = useSound();
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [game, setGame] = useState<GameMeta | null>(null);
  const [result, setResult] = useState<{
    score: number;
    maxScore: number;
    rankToday?: number;
    leaderboardError?: boolean;
  } | null>(null);

  async function finish(payload: unknown) {
    if (!game) return;
    if (!muted) sfx.complete();
    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name, gameId: game.id, payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ score: data.score ?? 0, maxScore: data.maxScore ?? game.maxScore, leaderboardError: true });
      } else {
        setResult({
          score: data.score,
          maxScore: data.maxScore,
          rankToday: data.rankToday,
          leaderboardError: Boolean(data.leaderboardError),
        });
      }
    } catch {
      setResult({ score: 0, maxScore: game.maxScore, leaderboardError: true });
    }
    setStep("result");
  }

  function startName(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = name.trim();
    if (cleaned.length < 1 || cleaned.length > 20) {
      setError("Name must be 1–20 characters.");
      return;
    }
    setName(cleaned);
    setError("");
    setStep("wheel");
  }

  const Component = game ? GAME_COMPONENTS[game.id] : null;

  return (
    <div className={booth ? "booth-scale" : ""}>
      {step === "name" ? (
        <form onSubmit={startName} className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
          <h1 className="font-display text-4xl sm:text-5xl">What&apos;s your name?</h1>
          <input
            className="arcade-input w-full text-center text-2xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoFocus
            autoComplete="nickname"
          />
          {error ? <p className="text-magenta">{error}</p> : null}
          <button className="arcade-btn arcade-btn-magenta px-10 py-3 text-xl" type="submit">
            Start
          </button>
        </form>
      ) : null}

      {step === "wheel" ? (
        <GameWheel
          games={games}
          onPicked={(picked) => {
            setGame(picked);
            setStep("howto");
          }}
        />
      ) : null}

      {step === "howto" && game ? (
        <div className="mx-auto max-w-xl text-center">
          <p className="text-5xl">{game.icon}</p>
          <h2 className="mt-2 font-display text-4xl">{game.name}</h2>
          <p className="mt-4 text-xl text-cream/80">{game.howToPlay}</p>
          <button className="arcade-btn arcade-btn-cyan mt-8 px-10 py-3 text-xl" type="button" onClick={() => setStep("play")}>
            Start game
          </button>
        </div>
      ) : null}

      {step === "play" && game && Component ? (
        <GameShell game={game} playerName={name} onExit={() => setStep("wheel")}>
          <Component onComplete={finish} />
        </GameShell>
      ) : null}

      {step === "result" && game && result ? (
        <div className="relative mx-auto max-w-lg overflow-hidden text-center">
          {result.score >= 70 ? <div className="pointer-events-none absolute inset-0 confetti" /> : null}
          <p className="font-display text-4xl text-ticket">Great job!</p>
          <h2 className="mt-2 font-display text-3xl">
            {game.icon} {game.name}
          </h2>
          <p className="mt-6 font-display text-6xl text-cyan">
            {result.score} <span className="text-3xl text-cream/50">/ {result.maxScore}</span>
          </p>
          {result.leaderboardError ? (
            <p className="mt-4 text-ticket">Leaderboard temporarily unavailable. Your score is still valid!</p>
          ) : (
            <p className="mt-4 text-xl">🏆 Your rank today #{result.rankToday}</p>
          )}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              className="arcade-btn arcade-btn-magenta px-8 py-3"
              type="button"
              onClick={() => {
                setResult(null);
                setGame(null);
                setStep("wheel");
              }}
            >
              Spin the wheel
            </button>
            <Link href="/leaderboard" className="arcade-btn arcade-btn-gold px-8 py-3">
              View leaderboard
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
