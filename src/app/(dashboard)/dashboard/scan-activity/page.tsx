import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatScanTimestamp } from "@/lib/datetime/scan-timestamp";
import { googleMapsUrl } from "@/lib/geo/maps";
import {
  deviceLabel,
  formatEventLocation,
  scanSourceLabel,
} from "@/lib/geo/labels";
import { eventTypeLabel, type FinderEventRow, type OwnerScanStats } from "@/lib/scan/events";
import { Activity, Bell, MapPin, Phone, MessageCircle, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  sub?: string;
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
          {sub ? <p className="text-xs text-qn-muted-2">{sub}</p> : null}
        </div>
      </div>
    </div>
  );
}

function EventRow({ ev }: { ev: FinderEventRow }) {
  const ts = formatScanTimestamp(ev.created_at, {
    scannerTimezone: ev.scanner_timezone,
    country: ev.country,
  });
  const loc = formatEventLocation({
    city: ev.city,
    region: ev.region,
    country: ev.country,
  });
  const dev = deviceLabel(ev.browser, ev.device);
  const hasMap =
    ev.latitude != null &&
    ev.longitude != null &&
    Number.isFinite(ev.latitude) &&
    Number.isFinite(ev.longitude);

  return (
    <tr className="border-b border-white/[0.06] text-sm hover:bg-white/[0.02]">
      <td className="px-3 py-3 align-top whitespace-nowrap">
        <span className="block font-medium text-white">{ev.tag_title ?? "Tag"}</span>
        <span className="text-xs text-qn-muted-2">{scanSourceLabel(ev.kind, ev.reason)}</span>
        <span className="mt-1 block text-xs text-qn-muted">{ts.date}</span>
      </td>
      <td className="px-3 py-3 align-top whitespace-nowrap text-qn-muted">
        {ts.time} {ts.tzLabel}
      </td>
      <td className="px-3 py-3 align-top text-white">
        {eventTypeLabel(ev.event_type)}
      </td>
      <td className="px-3 py-3 align-top text-qn-muted-2">
        {ev.reason ?? "—"}
      </td>
      <td className="px-3 py-3 align-top text-qn-muted-2 max-w-[160px]">
        {loc ?? "—"}
      </td>
      <td className="px-3 py-3 align-top">
        {hasMap ? (
          <Link
            href={googleMapsUrl(ev.latitude!, ev.longitude!)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-qn-accent hover:underline"
          >
            Open Map
          </Link>
        ) : (
          <span className="text-xs text-qn-muted-2">—</span>
        )}
      </td>
      <td className="px-3 py-3 align-top text-xs text-qn-muted-2">
        {dev ?? "—"}
      </td>
    </tr>
  );
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
    top_location: null,
    recent_events: [],
  }) as OwnerScanStats;

  const recent = stats.recent_events ?? [];

  return (
    <div>
      <h1 className="qn-page-title text-white">Scan Activity</h1>
      <p className="mt-2 text-sm text-qn-muted">
        Scans, contact clicks, and emergency alerts. Times use the scanner&apos;s
        local timezone when available.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total scans" value={stats.total_scans} icon={Activity} />
        <StatCard label="Today (IST)" value={stats.today_scans} icon={Bell} />
        <StatCard
          label="Top location (30d)"
          value={stats.top_location ?? "—"}
          icon={MapPin}
        />
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

      <div className="qn-table-wrap mt-8 overflow-x-auto">
        <p className="border-b border-white/[0.06] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-qn-muted-2">
          Recent activity
        </p>
        {!recent.length ? (
          <p className="px-4 py-8 text-center text-sm text-qn-muted">
            No activity yet. Scans will appear here when someone opens your public
            tag page.
          </p>
        ) : (
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-qn-muted-2">
                <th className="px-3 py-2 font-semibold">Tag / Date</th>
                <th className="px-3 py-2 font-semibold">Time</th>
                <th className="px-3 py-2 font-semibold">Action</th>
                <th className="px-3 py-2 font-semibold">Reason</th>
                <th className="px-3 py-2 font-semibold">Location</th>
                <th className="px-3 py-2 font-semibold">Map</th>
                <th className="px-3 py-2 font-semibold">Device</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((ev) => (
                <EventRow key={ev.id} ev={ev} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
