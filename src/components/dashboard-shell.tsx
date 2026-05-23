import { UserMenu } from "@/components/auth/user-menu";
import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/tags", label: "My QR tags" },
  { href: "/dashboard/scan-history", label: "Scan history" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-200 bg-white px-3 py-6 md:flex">
        <Link
          href="/"
          className="block px-2 text-sm font-bold tracking-tight text-[#111111]"
        >
          QRNetra
        </Link>
        <nav className="mt-6 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-2 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-[#111111]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <UserMenu variant="sidebar" />
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
          <div className="mb-3 flex justify-end">
            <UserMenu variant="header" />
          </div>
          <nav className="flex flex-wrap gap-2 text-xs font-medium text-zinc-700">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[#111111]">
                {l.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
