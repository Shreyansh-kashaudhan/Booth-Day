import { isAdmin } from "@/lib/admin";
import { loadAllGameMetaWithToggles } from "@/lib/game-runtime";
import { loadCatalog } from "@/lib/catalog";
import { AdminPanel } from "@/app/admin/AdminPanel";
import { AdminLoginClient } from "@/app/admin/AdminLoginClient";
import { ContentEditor } from "@/app/admin/ContentEditor";

export default async function AdminPage() {
  const authed = await isAdmin();
  if (!authed) return <AdminLoginClient />;
  const games = await loadAllGameMetaWithToggles();
  const catalog = await loadCatalog();
  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-16">
      <AdminPanel
        games={games}
        content={{
          words: catalog.words.length,
          dingbats: catalog.dingbats.length,
          bots: catalog.bots.length,
        }}
      />
      <ContentEditor initial={catalog} />
    </div>
  );
}
