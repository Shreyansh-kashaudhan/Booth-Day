"use client";

import { WORD_BATTLE_CONFIG, WORD_BATTLE_WORDS, type WordBattleEntry } from "@/games/wordle/wordle.data";
import { evaluateGuess, isWin, type TileState } from "@/games/wordle/wordle.logic";
import type { GameComponentProps } from "@/games/types";
import { sfx } from "@/lib/sound";
import { useSound } from "@/components/arcade/SoundProvider";
import { useCatalog } from "@/components/arcade/useCatalog";
import { useEffect, useState } from "react";

const KEYS = ["QWERTYUIOP".split(""), "ASDFGHJKL".split(""), ["ENTER", ..."ZXCVBNM".split(""), "DEL"]];

function tileClass(state?: TileState) {
  if (state === "correct") return "bg-arcade-go text-cabinet";
  if (state === "present") return "bg-ticket text-cabinet";
  if (state === "absent") return "bg-white/15 text-cream/70";
  return "bg-white/8 border border-white/20";
}

function keyClass(state?: TileState) {
  if (state === "correct") return "arcade-key-correct";
  if (state === "present") return "arcade-key-present";
  if (state === "absent") return "arcade-key-absent";
  return "";
}

const RANK: Record<TileState, number> = { absent: 1, present: 2, correct: 3 };

function keyStates(guesses: string[], target: string): Record<string, TileState> {
  const map: Record<string, TileState> = {};
  for (const guess of guesses) {
    const tiles = evaluateGuess(guess, target);
    guess.split("").forEach((letter, i) => {
      const next = tiles[i];
      if (!map[letter] || RANK[next] > RANK[map[letter]]) map[letter] = next;
    });
  }
  return map;
}

export function WordleGame({ onComplete }: GameComponentProps) {
  const { muted } = useSound();
  const catalog = useCatalog();
  const [target, setTarget] = useState<WordBattleEntry | null>(null);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [shake, setShake] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!catalog || target) return;
    const pool = catalog.words.filter((w) => w.word.length === WORD_BATTLE_CONFIG.wordLength);
    const list = pool.length ? pool : WORD_BATTLE_WORDS;
    setTarget(list[Math.floor(Math.random() * list.length)]);
  }, [catalog, target]);

  const length = WORD_BATTLE_CONFIG.wordLength;
  const maxAttempts = WORD_BATTLE_CONFIG.attempts;

  function commit(guess: string) {
    if (!target || done || guess.length !== length) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      if (!muted) sfx.wrong();
      return;
    }
    const tiles = evaluateGuess(guess, target.word);
    const next = [...guesses, guess];
    setGuesses(next);
    setCurrent("");
    const won = isWin(tiles);
    if (!muted) (won ? sfx.correct : sfx.wrong)();
    if (won || next.length >= maxAttempts) {
      setDone(true);
      onComplete({ word: target.word, guesses: next });
    }
  }

  function onKey(key: string) {
    if (done) return;
    if (key === "ENTER") {
      commit(current);
      return;
    }
    if (key === "DEL" || key === "BACKSPACE") {
      setCurrent((c) => c.slice(0, -1));
      return;
    }
    if (/^[A-Z]$/.test(key) && current.length < length) setCurrent((c) => c + key);
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key === "Backspace" ? "DEL" : e.key === "Enter" ? "ENTER" : e.key.toUpperCase();
      if (key === "DEL" || key === "ENTER" || /^[A-Z]$/.test(key)) {
        e.preventDefault();
        onKey(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const rows = Array.from({ length: maxAttempts }, (_, i) => {
    if (!target) return { letters: Array(length).fill(""), tiles: undefined };
    if (guesses[i]) return { letters: guesses[i].split(""), tiles: evaluateGuess(guesses[i], target.word) };
    if (i === guesses.length) return { letters: current.padEnd(length).split(""), tiles: undefined };
    return { letters: Array(length).fill(""), tiles: undefined };
  });
  const keys = target ? keyStates(guesses, target.word) : {};

  if (!target) {
    return <p className="text-center font-mono uppercase tracking-widest text-cream/60">Loading…</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`grid gap-1.5 ${shake ? "animate-shake" : ""}`}>
        {rows.map((row, r) => (
          <div key={r} className="flex gap-1.5">
            {row.letters.map((letter, c) => (
              <div
                key={c}
                className={`flex h-12 w-12 items-center justify-center rounded-md font-display text-xl uppercase ${tileClass(row.tiles?.[c])}`}
              >
                {letter.trim()}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex w-full max-w-lg flex-col gap-1.5">
        {KEYS.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => onKey(key)}
                className={`arcade-key ${key.length > 1 ? "px-3 text-xs" : "w-8"} ${key.length === 1 ? keyClass(keys[key]) : ""}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
