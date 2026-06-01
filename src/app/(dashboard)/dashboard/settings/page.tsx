import { createClient } from "@/lib/supabase/server";
import { getAccountSettingsData } from "@/app/actions/settings";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/settings");

  const initial = await getAccountSettingsData();
  if (!initial) redirect("/login?next=/dashboard/settings");

  const { data: supportHistory } = await supabase
    .from("support_requests")
    .select("id, category, subject, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const { count: tagCount } = await supabase
    .from("tag_units")
    .select("id", { count: "exact", head: true })
    .eq("owner_user_id", user.id)
    .not("activated_at", "is", null);

  const { count: orderCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: statsRaw } = await supabase.rpc("get_owner_scan_stats", {
    p_user_id: user.id,
  });
  const totalScans =
    statsRaw && typeof statsRaw === "object"
      ? Number((statsRaw as { total_scans?: number }).total_scans ?? 0)
      : 0;

  return (
    <div>
      <h1 className="qn-page-title text-white">Settings</h1>
      <p className="mt-2 text-sm text-qn-muted">
        Account, notifications, security, and privacy preferences.
      </p>
      <div className="mt-8">
        <SettingsPageClient
          initial={initial}
          supportHistory={supportHistory ?? []}
          connected={{
            tagCount: tagCount ?? 0,
            totalScans,
            orderCount: orderCount ?? 0,
          }}
        />
      </div>
    </div>
  );
}
