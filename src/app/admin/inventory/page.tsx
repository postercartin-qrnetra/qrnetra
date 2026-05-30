import { getCurrentAdminUser } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { InventoryAdminPanel } from "@/components/admin/inventory-admin-panel";
import { getInventoryAnalyticsAction } from "@/app/actions/admin-inventory";
import Link from "next/link";

export default async function AdminInventoryPage() {
  const admin = await getCurrentAdminUser();
  if (admin.error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="qn-card p-8 text-center">
          <p className="text-lg font-semibold text-white">Admin access required</p>
          <p className="mt-2 text-sm text-qn-muted">{admin.error}</p>
        </div>
      </div>
    );
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="qn-card p-8 text-center">
          <p className="text-lg font-semibold text-white">Admin client not configured</p>
          <p className="mt-2 text-sm text-qn-muted">
            Add SUPABASE_SERVICE_ROLE_KEY to manage inventory.
          </p>
        </div>
      </div>
    );
  }

  const statuses = [
    "generated",
    "printed",
    "reserved",
    "sold",
    "activated",
    "disabled",
    "locked",
    "transferred",
    "replaced",
  ] as const;

  const metrics: Record<string, number> = {};
  for (const status of statuses) {
    const { count } = await supabase
      .from("tag_units")
      .select("id", { count: "exact", head: true })
      .eq("status", status);
    metrics[status] = count ?? 0;
  }

  const { data: batches } = await supabase
    .from("inventory_batches")
    .select("id, batch_number, product_type, quantity, channel, generated_at")
    .order("generated_at", { ascending: false })
    .limit(20);

  const analytics = await getInventoryAnalyticsAction();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-qn-accent">
            Admin · Inventory
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white">Tag inventory</h1>
          <p className="mt-2 max-w-2xl text-sm text-qn-muted">
            Generate physical tag units, export batches for printing, and track
            activation status.
          </p>
        </div>
        <Link href="/admin" className="qn-btn-secondary text-sm">
          Order fulfillment
        </Link>
      </div>

      <InventoryAdminPanel
        metrics={metrics}
        batches={batches ?? []}
        batchAnalytics={analytics.batches}
        channelStats={analytics.channelStats}
      />
    </div>
  );
}
