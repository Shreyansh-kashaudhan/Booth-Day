"use client";

import { DINGBAT_SET_LABEL, DINGBATS_CONFIG, pickPuzzles, type DingbatPuzzle } from "@/games/dingbats/dingbats.data";
import { dingbatMatches } from "@/games/dingbats/dingbats.definition";
import type { GameComponentProps } from "@/games/types";
import { sfx } from "@/lib/sound";
import { useSound } from "@/components/arcade/SoundProvider";
import { useCatalog } from "@/components/arcade/useCatalog";
import { useEffect, useState } from "react";

export function DingbatsGame({ onComplete }: GameComponentProps) {
  const { muted } = useSound();
  const catalog = useCatalog();
  const [puzzles, setPuzzles] = useState<DingbatPuzzle[] | null>(null);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [hint, setHint] = useState(false);
  const [triesLeft, setTriesLeft] = useState(DINGBATS_CONFIG.guessesPerPuzzle);
  const [answers, setAnswers] = useState<{ id: string; guess: string; usedHint: boolean }[]>([]);
  const [feedback, setFeedback] = useState<"ok" | "no" | null>(null);
  const [locked, setLocked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!catalog || puzzles) return;
    setPuzzles(pickPuzzles(catalog.dingbatsSettings?.puzzlesPerRound ?? DINGBATS_CONFIG.puzzlesPerRound, catalog.dingbats));
  }, [catalog, puzzles]);

  if (!puzzles) {
    return <p className="text-center font-mono uppercase tracking-widest text-cream/60">Loading…</p>;
  }

  const roundPuzzles = puzzles;
  const puzzle = roundPuzzles[index];
  const lastPuzzle = index + 1 >= roundPuzzles.length;

  function goNext(guessValue: string) {
    if (locked) return;
    setLocked(true);
    const nextAnswers = [...answers, { id: puzzle.id, guess: guessValue, usedHint: hint || revealed }];
    if (lastPuzzle) {
      onComplete({ answers: nextAnswers });
      return;
    }
    setAnswers(nextAnswers);
    setIndex(index + 1);
    setGuess("");
    setHint(false);
    setRevealed(false);
    setTriesLeft(DINGBATS_CONFIG.guessesPerPuzzle);
    setFeedback(null);
    setLocked(false);
  }

  function submit() {
    if (locked || !guess.trim()) return;
    const ok = dingbatMatches(puzzle.id, guess, roundPuzzles);
    setFeedback(ok ? "ok" : "no");
    if (!muted) (ok ? sfx.correct : sfx.wrong)();

    if (ok) {
      setLocked(true);
      setTimeout(() => {
        setLocked(false);
        goNext(guess);
      }, 650);
      return;
    }

    setTriesLeft(triesLeft - 1);
    setGuess("");
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-cream/60">
        Puzzle {index + 1} / {roundPuzzles.length} · {triesLeft} {triesLeft === 1 ? "try" : "tries"} left
      </p>
      <p className="arcade-chip arcade-chip-on">{DINGBAT_SET_LABEL[puzzle.set ?? "classic"]}</p>
      <div className={`card-panel w-full px-6 py-10 text-center ${feedback === "no" ? "animate-shake" : ""} ${feedback === "ok" ? "ring-2 ring-arcade-go" : ""}`}>
        <pre
          className={`leading-tight text-cream whitespace-pre-wrap ${puzzle.display === "emoji" ? "font-sans text-5xl sm:text-6xl" : "font-display text-3xl"}`}
        >
          {puzzle.content}
        </pre>
      </div>
      {hint && puzzle.hint ? <p className="text-ticket">{puzzle.hint}</p> : null}
      {revealed ? <p className="text-sm text-ticket">{puzzle.answer}</p> : null}
      {feedback === "no" && triesLeft > 0 ? <p className="text-magenta">Not quite. Try again.</p> : null}
      <form
        className="flex w-full flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          className="arcade-input flex-1"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type the phrase"
          autoFocus
          disabled={locked}
        />
        <button className="arcade-btn arcade-btn-cyan" type="submit" disabled={locked}>
          Guess
        </button>
      </form>
      <div className="flex w-full items-center justify-between gap-4">
        <button
          className="text-[11px] uppercase tracking-widest text-cream/35 hover:text-cream/70"
          type="button"
          onClick={() => setRevealed(true)}
        >
          Show answer
        </button>
        <button
          className="arcade-btn arcade-btn-gold px-5 py-2 text-sm"
          type="button"
          onClick={() => goNext(guess.trim())}
          disabled={locked}
        >
          {lastPuzzle ? "Finish" : "Next"}
        </button>
      </div>
      {!hint && puzzle.hint ? (
        <button className="text-sm uppercase tracking-widest text-cream/50" type="button" onClick={() => setHint(true)}>
          Need a hint?
        </button>
      ) : null}
    </div>
  );
}
