import Link from "next/link";

const COLS = [
  {
    title: "Products",
    links: [
      { href: "/#products", label: "Vehicle QR" },
      { href: "/#products", label: "Child Wristband" },
      { href: "/#products", label: "Pet Tags" },
      { href: "/bulk-orders", label: "Fleet & B2B" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/track-order", label: "Track Order" },
      { href: "/create/type", label: "Create QR" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-and-conditions", label: "Terms" },
      { href: "/refund-policy", label: "Refund Policy" },
      { href: "/shipping-policy", label: "Shipping Policy" },
      { href: "/cookie-policy", label: "Cookies" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

function AppStoreBadge({ store }: { store: "apple" | "google" }) {
  if (store === "apple") {
    return (
      <div className="flex h-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-[10px] font-medium text-white">
        <span>App Store</span>
      </div>
    );
  }
  return (
    <div className="flex h-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-[10px] font-medium text-white">
      <span>Google Play</span>
    </div>
  );
}

export function MainFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-[#111111] text-zinc-300">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-white"
            >
              QRNetra
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              Privacy-first smart QR safety for vehicles, families, and
              emergencies. Built for India.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <AppStoreBadge store="apple" />
              <AppStoreBadge store="google" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-zinc-500">
              <span className="rounded-full border border-zinc-700 px-3 py-1">
                SSL Secure
              </span>
              <span className="rounded-full border border-zinc-700 px-3 py-1">
                Razorpay
              </span>
              <span className="rounded-full border border-zinc-700 px-3 py-1">
                DPDP-ready
              </span>
            </div>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-zinc-800 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4">
            <a
              href="https://instagram.com"
              className="text-sm text-zinc-400 hover:text-[#ffd400]"
              rel="noopener noreferrer"
              target="_blank"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/"
              className="text-sm text-zinc-400 hover:text-[#ffd400]"
              rel="noopener noreferrer"
              target="_blank"
            >
              WhatsApp
            </a>
            <a
              href="https://linkedin.com"
              className="text-sm text-zinc-400 hover:text-[#ffd400]"
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
          </div>
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} QRNetra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
