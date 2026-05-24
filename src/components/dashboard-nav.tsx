"use client";

import {
  LayoutDashboard,
  QrCode,
  ScanLine,
  Package,
  User,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/tags", label: "My QR tags", icon: QrCode },
  { href: "/dashboard/scan-history", label: "Scan history", icon: ScanLine },
  { href: "/dashboard/orders", label: "Orders", icon: Package },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-1">
      {links.map((l) => {
        const active = isActive(pathname, l.href, l.exact);
        const Icon = l.icon;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "border-l-2 border-qn-accent bg-[rgba(255,107,44,0.12)] text-white"
                : "border-l-2 border-transparent text-qn-muted hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${active ? "text-qn-accent" : "text-qn-muted-2"}`}
              strokeWidth={1.75}
            />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 text-xs font-medium">
      {links.map((l) => {
        const active = isActive(pathname, l.href, l.exact);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-lg px-2.5 py-1.5 transition-colors ${
              active
                ? "bg-[rgba(255,107,44,0.15)] text-qn-accent"
                : "text-qn-muted hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}