import { FadeIn } from "@/components/ui/motion";
import {
  Activity,
  Bell,
  Car,
  Dog,
  LayoutDashboard,
  QrCode,
  Settings,
  User,
} from "lucide-react";
import { Section } from "./section";

const STATS = [
  { label: "Active Tags", value: "12", icon: QrCode },
  { label: "Scans (30d)", value: "1,248", icon: Activity },
  { label: "Alerts Sent", value: "342", icon: Bell },
  { label: "Profiles", value: "6", icon: User },
];

const SCANS = [
  {
    name: "Vehicle Sticker",
    location: "MG Road, Bengaluru",
    time: "2 min ago",
    status: "Contacted",
    pill: "success" as const,
  },
  {
    name: "Pet Tag — Bruno",
    location: "Bandra West, Mumbai",
    time: "18 min ago",
    status: "Viewed",
    pill: "info" as const,
  },
  {
    name: "Child Wristband",
    location: "Koramangala, Bengaluru",
    time: "1 hr ago",
    status: "Alert sent",
    pill: "accent" as const,
  },
];

const PROFILES = [
  { name: "Vehicle — MH-12-AB-1234", icon: Car },
  { name: "Bruno (Labrador)", icon: Dog },
];

const pillClass = {
  success: "qn-pill-success",
  info: "qn-pill-info",
  accent: "qn-pill-accent",
};

export function DashboardSection() {
  return (
    <Section className="border-t border-white/[0.08]">
      <FadeIn className="text-center">
        <span className="qn-badge">Dashboard</span>
        <h2 className="qn-section-title mt-4 text-white">Your Command Center</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-qn-muted">
          Every tag, scan, and emergency profile managed from one calm, modern
          surface.
        </p>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-14">
        <div className="rounded-[20px] border border-qn-accent/30 bg-qn-card p-1 shadow-[0_0_48px_rgba(255,107,44,0.12)]">
          <div className="overflow-hidden rounded-[18px] border border-white/[0.08] bg-qn-bg-elevated">
            <div className="flex min-h-[480px]">
              <aside className="hidden w-48 shrink-0 border-r border-white/[0.08] bg-qn-sidebar p-4 sm:block">
                <p className="text-xs font-bold text-white">
                  QR<span className="text-qn-accent">Netra</span>
                </p>
                <nav className="mt-6 space-y-1">
                  {[
                    { label: "Overview", icon: LayoutDashboard, active: true },
                    { label: "My Tags", icon: QrCode },
                    { label: "Alerts", icon: Bell },
                    { label: "Profiles", icon: User },
                    { label: "Analytics", icon: Activity },
                    { label: "Settings", icon: Settings },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium ${
                        item.active
                          ? "border-l-2 border-qn-accent bg-[rgba(255,107,44,0.12)] text-white"
                          : "text-qn-muted-2"
                      }`}
                    >
                      <item.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {item.label}
                    </div>
                  ))}
                </nav>
              </aside>

              <div className="flex-1 p-4 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {STATS.map((s) => (
                    <div key={s.label} className="qn-card p-4">
                      <div className="flex items-start justify-between">
                        <p className="text-xs text-qn-muted">{s.label}</p>
                        <s.icon
                          className="h-4 w-4 text-qn-accent"
                          strokeWidth={1.75}
                        />
                      </div>
                      <p className="mt-2 text-2xl font-extrabold text-white">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="qn-card mt-4 p-4">
                  <p className="text-sm font-semibold text-white">Recent Scans</p>
                  <div className="mt-4 space-y-0">
                    {SCANS.map((row) => (
                      <div
                        key={row.name}
                        className="qn-table-row text-sm"
                      >
                        <div>
                          <p className="font-medium text-white">{row.name}</p>
                          <p className="text-xs text-qn-muted">{row.location}</p>
                        </div>
                        <div className="flex items-center gap-3 sm:text-right">
                          <span className="text-xs text-qn-muted-2">
                            {row.time}
                          </span>
                          <span className={pillClass[row.pill]}>{row.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="qn-card p-4">
                    <p className="text-sm font-semibold text-white">
                      Active Profiles
                    </p>
                    <ul className="mt-4 space-y-3">
                      {PROFILES.map((p) => (
                        <li
                          key={p.name}
                          className="flex items-center gap-3 text-sm text-qn-muted"
                        >
                          <p.icon
                            className="h-4 w-4 text-qn-accent"
                            strokeWidth={1.75}
                          />
                          {p.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="qn-card p-4">
                    <p className="text-sm font-semibold text-white">
                      Quick Actions
                    </p>
                    <div className="mt-4 space-y-2">
                      <button
                        type="button"
                        className="qn-btn-primary w-full text-left"
                      >
                        Enable Lost Mode
                      </button>
                      <button type="button" className="qn-btn-secondary w-full">
                        Add New Profile
                      </button>
                      <button type="button" className="qn-btn-secondary w-full">
                        Order More Stickers
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
