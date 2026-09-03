"use client";

import { PERFECT10_CONFIG, runningTimerOpacity } from "@/games/perfect10/perfect10.data";
import { scorePerfect10 } from "@/games/perfect10/perfect10.definition";
import type { GameComponentProps } from "@/games/types";
import { sfx } from "@/lib/sound";
import { useSound } from "@/components/arcade/SoundProvider";
import { useCatalog } from "@/components/arcade/useCatalog";
import { useEffect, useRef, useState } from "react";

export function Perfect10Game({ onComplete }: GameComponentProps) {
  const { muted } = useSound();
  const catalog = useCatalog();
  const targetSeconds = catalog?.perfect10.targetSeconds ?? PERFECT10_CONFIG.targetSeconds;
  const maxAttempts = catalog?.perfect10.attempts ?? PERFECT10_CONFIG.attempts;
  const [phase, setPhase] = useState<"ready" | "running" | "review">("ready");
  const [display, setDisplay] = useState(0);
  const [attemptsMs, setAttemptsMs] = useState<number[]>([]);
  const startRef = useRef(0);
  const raf = useRef<number>(0);
  const phaseRef = useRef(phase);
  const attemptsRef = useRef(attemptsMs);

  useEffect(() => {
    phaseRef.current = phase;
    attemptsRef.current = attemptsMs;
  }, [phase, attemptsMs]);

  const tryNumber = attemptsMs.length + (phase === "review" ? 0 : 1);
  const remainingAfterReview = maxAttempts - attemptsMs.length;

  useEffect(() => {
    if (phase !== "running") return;
    const tick = () => {
      setDisplay((performance.now() - startRef.current) / 1000);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [phase]);

  function start() {
    if (phaseRef.current !== "ready") return;
    startRef.current = performance.now();
    setDisplay(0);
    phaseRef.current = "running";
    setPhase("running");
    if (!muted) sfx.countdown();
  }

  function stop() {
    if (phaseRef.current !== "running") return;
    const elapsedMs = performance.now() - startRef.current;
    const next = [...attemptsRef.current, elapsedMs];
    attemptsRef.current = next;
    setAttemptsMs(next);
    phaseRef.current = "review";
    setPhase("review");
    setDisplay(elapsedMs / 1000);
    if (!muted) sfx.complete();
    if (next.length >= maxAttempts) {
      setTimeout(() => onComplete({ attemptsMs: next }), 800);
    }
  }

  function nextTry() {
    if (phaseRef.current !== "review") return;
    if (attemptsRef.current.length >= maxAttempts) return;
    setDisplay(0);
    phaseRef.current = "ready";
    setPhase("ready");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.key !== " ") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      e.preventDefault();
      if (phaseRef.current === "ready") start();
      else if (phaseRef.current === "running") stop();
      else nextTry();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const urgency = phase === "running" && display > targetSeconds - 1.5;
  const lastScore = phase === "review" ? scorePerfect10(attemptsMs.at(-1) ?? 0, targetSeconds) : null;

  const timerOpacity = phase === "running" ? runningTimerOpacity(display) : 1;

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-mono uppercase tracking-[0.4em] text-cream/60">
        Stop on {targetSeconds.toFixed(2)} · try {Math.min(tryNumber, maxAttempts)} / {maxAttempts}
      </p>
      <div
        className={`font-display text-8xl tabular-nums ${urgency ? "text-magenta animate-pulse" : "text-ticket"}`}
        style={{ opacity: timerOpacity, transition: phase === "running" ? undefined : "opacity 0.2s ease" }}
      >
        {display.toFixed(2)}
      </div>
      <p className="font-mono text-sm uppercase tracking-widest text-cream/50">
        {phase === "ready" ? "The clock fades after 6 seconds — feel for 10. " : ""}
        Spacebar also starts and stops
      </p>
      {phase === "ready" ? (
        <button className="arcade-btn arcade-btn-gold text-2xl" type="button" onClick={start}>
          Start
        </button>
      ) : null}
      {phase === "running" ? (
        <button className="arcade-btn arcade-btn-magenta text-2xl" type="button" onClick={stop}>
          Stop
        </button>
      ) : null}
      {phase === "review" && lastScore ? (
        <div className="text-center">
          <p className="text-xl text-cream/80">
            {lastScore.score} pts · {remainingAfterReview} {remainingAfterReview === 1 ? "try" : "tries"} left
          </p>
          {remainingAfterReview > 0 ? (
            <button className="arcade-btn arcade-btn-cyan mt-4 text-xl" type="button" onClick={nextTry}>
              Try again
            </button>
          ) : (
            <p className="mt-3 text-ticket">Best of 3 is your score</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
