import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Activity, Bell, QrCode, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const supabase = await createClient();
  if (!supabase) {
    return null;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: tags } = await supabase
    .from("qrs")
    .select("id, public_slug, kind, title, created_at, vehicle_registration")
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false });

  const ids = tags?.map((t) => t.id) ?? [];
  let totalScans = 0;
  let lastScanAt: string | null = null;

  if (ids.length > 0) {
    const { count } = await supabase
      .from("scan_events")
      .select("id", { count: "exact", head: true })
      .in("qr_id", ids);
    totalScans = count ?? 0;

    const { data: lastEv } = await supabase
      .from("scan_events")
      .select("created_at")
      .in("qr_id", ids)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    lastScanAt = lastEv?.created_at ?? null;
  }

  const activeCount = tags?.filter((t) => t).length ?? 0;
  const lastLabel = lastScanAt
    ? new Date(lastScanAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  const statCards = [
    {
      label: "Active tags",
      value: String(activeCount),
      href: "/dashboard/tags",
      icon: QrCode,
    },
    {
      label: "Total scans",
      value: String(totalScans),
      href: "/dashboard/scan-history",
      icon: Activity,
    },
    {
      label: "Last scanned",
      value: lastLabel,
      href: "/dashboard/scan-history",
      icon: Bell,
    },
    {
      label: "Profile type",
      value: tags?.[0]?.kind
        ? tags[0].kind.charAt(0).toUpperCase() + tags[0].kind.slice(1)
        : "—",
      href: "/dashboard/tags",
      icon: User,
    },
  ];

  return (
    <div>
      <h1 className="qn-page-title text-white">Dashboard</h1>
      <p className="mt-2 max-w-xl text-sm text-qn-muted">
        Manage QR tags, scan activity, and emergency profiles.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="qn-card qn-card-interactive block p-6"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-qn-muted">
                  {card.label}
                </p>
                <Icon
                  className="h-4 w-4 text-qn-accent"
                  strokeWidth={1.75}
                />
              </div>
              <p className="mt-3 text-xl font-extrabold text-white">
                {card.value}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/dashboard/tags" className="qn-btn-primary px-6">
          My QR tags
        </Link>
        <Link href="/create" className="qn-btn-secondary px-6">
          Create another QR
        </Link>
        <Link href="/products" className="qn-btn-secondary px-6">
          Shop tags
        </Link>
      </div>
    </div>
  );
}
