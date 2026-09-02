import { PlayFlow } from "@/components/arcade/PlayFlow";
import { loadEnabledGameMeta } from "@/lib/game-runtime";

export const dynamic = "force-dynamic";

export default async function PlayPage() {
  const games = await loadEnabledGameMeta();
  return (
    <div className="mx-auto max-w-5xl pt-4">
      <PlayFlow games={games} />
    </div>
  );
}
