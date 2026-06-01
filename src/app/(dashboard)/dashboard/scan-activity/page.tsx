import { createClient } from "@/lib/supabase/server";
import { eventTypeLabel, type FinderEventRow, type OwnerScanStats } from "@/lib/scan/events";
import { Activity, Bell, Phone, MessageCircle, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <div className="qn-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-qn-accent/10">
          <Icon className="h-5 w-5 text-qn-accent" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-qn-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}

function locationLabel(ev: FinderEventRow): string | null {
  if (ev.city && ev.country) return `${ev.city}, ${ev.country}`;
  if (ev.city) return ev.city;
  if (ev.country) return ev.country;
  return null;
}

export default async function ScanActivityPage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: statsRaw, error } = await supabase.rpc("get_owner_scan_stats", {
    p_user_id: user.id,
  });

  if (error) {
    return (
      <p className="text-sm text-qn-danger">
        Could not load scan activity: {error.message}
      </p>
    );
  }

  const stats = (statsRaw ?? {
    total_scans: 0,
    today_scans: 0,
    call_clicks: 0,
    whatsapp_clicks: 0,
    emergency_clicks: 0,
    recent_events: [],
  }) as OwnerScanStats;

  const recent = stats.recent_events ?? [];

  return (
    <div>
      <h1 className="qn-page-title text-white">Scan Activity</h1>
      <p className="mt-2 text-sm text-qn-muted">
        Scans, contact clicks, and emergency alerts on your public tags.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total scans" value={stats.total_scans} icon={Activity} />
        <StatCard label="Today" value={stats.today_scans} icon={Bell} />
        <StatCard label="Call clicks" value={stats.call_clicks} icon={Phone} />
        <StatCard
          label="WhatsApp clicks"
          value={stats.whatsapp_clicks}
          icon={MessageCircle}
        />
        <StatCard
          label="Emergency alerts"
          value={stats.emergency_clicks}
          icon={AlertTriangle}
        />
      </div>

      <div className="qn-table-wrap mt-8">
        <p className="border-b border-white/[0.06] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-qn-muted-2">
          Recent activity
        </p>
        {!recent.length ? (
          <p className="px-4 py-8 text-center text-sm text-qn-muted">
            No activity yet. Scans will appear here when someone opens your public
            tag page.
          </p>
        ) : (
          recent.map((ev) => {
            const loc = locationLabel(ev);
            return (
              <div key={ev.id} className="qn-table-row">
                <div>
                  <p className="font-medium text-white">
                    {ev.tag_title ?? "Tag"}
                  </p>
                  <p className="text-xs text-qn-muted-2">
                    {eventTypeLabel(ev.event_type)}
                    {ev.reason ? ` · ${ev.reason}` : ""}
                  </p>
                  <p className="font-mono text-xs text-qn-muted-2">
                    /s/{ev.slug}
                  </p>
                </div>
                <div className="text-sm text-qn-muted sm:text-right">
                  <p>
                    {new Date(ev.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  {loc ? (
                    <p className="text-xs text-qn-muted-2">{loc}</p>
                  ) : null}
                  {ev.device ? (
                    <p className="text-xs capitalize text-qn-muted-2">
                      {ev.device}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
