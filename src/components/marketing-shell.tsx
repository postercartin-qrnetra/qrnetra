import Link from "next/link";

const nav = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="font-semibold tracking-tight text-zinc-900">
            QRNetra
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-600">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-zinc-900">
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="rounded-full bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-800"
            >
              Log in
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-zinc-200 bg-white py-10">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 text-sm text-zinc-600 sm:grid-cols-2">
          <div>
            <p className="font-medium text-zinc-900">QRNetra</p>
            <p className="mt-2 max-w-xs">
              Privacy-first emergency contact using dynamic QR codes.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-and-conditions">Terms</Link>
            <Link href="/refund-policy">Refunds</Link>
            <Link href="/shipping-policy">Shipping</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
