import { QnLogo } from "@/components/ui/logo";
import Link from "next/link";

const COLS = [
  {
    title: "Products",
    links: [
      { href: "/create/type", label: "Vehicle QR" },
      { href: "/create/type", label: "Child Wristband" },
      { href: "/create/type", label: "Pet Tags" },
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
  const label = store === "apple" ? "App Store" : "Google Play";
  return (
    <div className="flex h-10 items-center justify-center rounded-lg border border-white/[0.12] bg-qn-card px-3 text-[10px] font-medium text-qn-muted">
      <span>{label}</span>
    </div>
  );
}

export function MainFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-qn-bg-deep">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <QnLogo size="lg" href="/" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-qn-muted">
              Privacy-first smart QR safety for vehicles, families, and
              emergencies. Built for India.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <AppStoreBadge store="apple" />
              <AppStoreBadge store="google" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-qn-muted-2">
              <span className="rounded-full border border-white/[0.1] px-3 py-1">
                SSL Secure
              </span>
              <span className="rounded-full border border-white/[0.1] px-3 py-1">
                Razorpay
              </span>
              <span className="rounded-full border border-white/[0.1] px-3 py-1">
                DPDP-ready
              </span>
            </div>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-qn-muted-2">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-qn-muted transition-colors hover:text-qn-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/[0.08] pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4">
            <a
              href="https://instagram.com"
              className="text-sm text-qn-muted transition-colors hover:text-qn-accent"
              rel="noopener noreferrer"
              target="_blank"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/"
              className="text-sm text-qn-muted transition-colors hover:text-qn-accent"
              rel="noopener noreferrer"
              target="_blank"
            >
              WhatsApp
            </a>
            <a
              href="https://linkedin.com"
              className="text-sm text-qn-muted transition-colors hover:text-qn-accent"
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
          </div>
          <div className="flex flex-col gap-1 sm:items-end">
            <p className="text-xs text-qn-muted-2">
              © {new Date().getFullYear()} QRNetra. All rights reserved.
            </p>
            <p className="text-xs text-qn-muted-2">Built for India 🇮🇳</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
