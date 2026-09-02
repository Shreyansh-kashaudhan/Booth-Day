import { BoothExperience } from "@/app/booth/BoothExperience";
import { loadEnabledGameMeta } from "@/lib/game-runtime";

export const dynamic = "force-dynamic";

export default async function BoothPage() {
  const games = await loadEnabledGameMeta();
  return <BoothExperience games={games} />;
}
