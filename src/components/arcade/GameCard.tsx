import type { GameMeta } from "@/games/types";
import Link from "next/link";

export function GameCard({ game }: { game: GameMeta }) {
  return (
    <div className="card-panel p-5" style={{ boxShadow: `0 0 24px ${game.accent}33` }}>
      <div className="text-4xl">{game.icon}</div>
      <h3 className="mt-3 font-display text-2xl">{game.name}</h3>
      <p className="mt-1 text-cream/70">{game.description}</p>
    </div>
  );
}

export function HomeActions() {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <Link href="/play" className="arcade-btn arcade-btn-magenta px-10 py-4 text-2xl">
        Start Playing
      </Link>
      <Link href="/leaderboard" className="arcade-btn arcade-btn-gold px-10 py-4 text-2xl">
        🏆 Leaderboard
      </Link>
    </div>
  );
}
