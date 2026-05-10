import { Section } from "./section";

const ROWS = [
  { label: "Active tags", value: "12", trend: "+2" },
  { label: "Scans (30d)", value: "1,248", trend: "+18%" },
  { label: "Alerts sent", value: "342", trend: "Stable" },
];

export function DashboardSection() {
  return (
    <Section className="border-t border-zinc-100 bg-white">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Dashboard
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
          Your command center
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-600 sm:text-base">
          Scan history, active tags, emergency profiles, notifications, and
          privacy controls — in one calm, modern surface.
        </p>
      </div>

      <div className="mt-14 rounded-3xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-4 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.2)] sm:p-8">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 bg-[#fafafa] px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#111111]" />
              <div>
                <p className="text-sm font-semibold text-[#111111]">QRNetra</p>
                <p className="text-xs text-zinc-500">Owner workspace</p>
              </div>
            </div>
            <div className="hidden gap-2 sm:flex">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                All tags
              </span>
              <span className="rounded-full bg-[#ffd400]/25 px-3 py-1 text-xs font-semibold text-[#111111]">
                Live
              </span>
            </div>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-3 sm:gap-6 sm:p-6">
            {ROWS.map((r) => (
              <div
                key={r.label}
                className="rounded-xl border border-zinc-100 bg-[#fafafa] p-4"
              >
                <p className="text-xs font-medium text-zinc-500">{r.label}</p>
                <p className="mt-1 text-2xl font-bold text-[#111111]">
                  {r.value}
                </p>
                <p className="mt-1 text-xs text-emerald-600">{r.trend}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 border-t border-zinc-100 p-4 sm:grid-cols-2 sm:gap-6 sm:p-6">
            <div className="rounded-xl border border-zinc-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Scan history
              </p>
              <div className="mt-4 flex h-28 items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-[#111111]/80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-zinc-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Emergency profile
              </p>
              <div className="mt-4 space-y-2">
                <div className="h-2 rounded-full bg-zinc-200" />
                <div className="h-2 w-4/5 rounded-full bg-zinc-100" />
                <div className="h-2 w-3/5 rounded-full bg-[#ffd400]/40" />
              </div>
              <div className="mt-4 flex gap-2">
                <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-600">
                  Masked call
                </span>
                <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-600">
                  WhatsApp
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 bg-[#fafafa] px-4 py-3 sm:px-6">
            <p className="text-xs text-zinc-500">
              Notifications · QR management · Privacy controls
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
