import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/my-qrs", label: "My QRs" },
  { href: "/dashboard/scan-history", label: "Scan history" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <aside className="hidden w-52 shrink-0 border-r border-zinc-200 bg-white px-3 py-6 md:block">
        <Link href="/" className="block px-2 text-sm font-semibold text-zinc-900">
          QRNetra
        </Link>
        <nav className="mt-6 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-2 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-wrap gap-3 text-xs font-medium text-zinc-700">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-zinc-900">
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
