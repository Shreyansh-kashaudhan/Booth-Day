import { GameCard, HomeActions } from "@/components/arcade/GameCard";
import { loadEnabledGameMeta } from "@/lib/game-runtime";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const games = await loadEnabledGameMeta();

  return (
    <div className="mx-auto max-w-6xl pt-6 text-center">
      <p className="font-mono uppercase tracking-[0.5em] text-cyan">Attract mode</p>
      <h1 className="marquee-title mt-3 font-display text-5xl leading-none sm:text-7xl md:text-8xl">
        Security
        <br />
        Arcade
      </h1>
      <p className="mt-4 font-display text-2xl text-ticket sm:text-4xl">Spin. Play. Outsmart.</p>
      <HomeActions />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
