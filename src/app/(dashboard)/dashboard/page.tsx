import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const supabase = await createClient();
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

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
        Dashboard
      </h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-600">
        Manage QR tags, scan activity, and emergency profiles.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Active tags",
            value: String(activeCount),
            href: "/dashboard/tags",
          },
          {
            label: "Total scans",
            value: String(totalScans),
            href: "/dashboard/scan-history",
          },
          {
            label: "Last scanned",
            value: lastLabel,
            href: "/dashboard/scan-history",
          },
          {
            label: "Profile type",
            value: tags?.[0]?.kind
              ? tags[0].kind.charAt(0).toUpperCase() + tags[0].kind.slice(1)
              : "—",
            href: "/dashboard/tags",
          },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {card.label}
            </p>
            <p className="mt-2 text-xl font-bold text-[#111111]">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/dashboard/tags"
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#111111] px-6 text-sm font-semibold text-white"
        >
          My QR tags
        </Link>
        <Link
          href="/create/type"
          className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-[#111111]"
        >
          Create another QR
        </Link>
        <Link
          href="/shop"
          className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-medium text-zinc-700"
        >
          Shop tags
        </Link>
      </div>
    </div>
  );
}
