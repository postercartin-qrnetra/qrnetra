import { QnLogo } from "@/components/ui/logo";
import Link from "next/link";
import { SUPPORT_CONTACT } from "@/lib/support/types";

const PRODUCT_LINKS = [
  { href: "/products/vehicles", label: "Vehicle QR" },
  { href: "/products/pets", label: "Pet QR" },
  { href: "/products/kids", label: "Kids QR" },
  { href: "/business-fleet", label: "Business QR" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
  { href: "/track-order", label: "Track Order" },
  { href: "/help", label: "Help Center" },
];

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
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
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <QnLogo variant="static" layout="footer" href="/" />
            <p className="mt-3 text-sm font-semibold text-white">
              Protect What Matters Most
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-qn-muted">
              Privacy-first QR identity, safety, and recovery for vehicles,
              families, pets, and everyday belongings. Built for India.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <AppStoreBadge store="apple" />
              <AppStoreBadge store="google" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-qn-muted-2">
              Products
            </p>
            <ul className="mt-4 space-y-3">
              {PRODUCT_LINKS.map((l) => (
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
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-qn-muted-2">
              Company
            </p>
            <ul className="mt-4 space-y-3">
              {COMPANY_LINKS.map((l) => (
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
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-qn-muted-2">
              Legal
            </p>
            <ul className="mt-4 space-y-3">
              {LEGAL_LINKS.map((l) => (
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
              href={SUPPORT_CONTACT.whatsappUrl}
              className="text-sm text-qn-muted transition-colors hover:text-qn-accent"
              rel="noopener noreferrer"
              target="_blank"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:${SUPPORT_CONTACT.email}`}
              className="text-sm text-qn-muted transition-colors hover:text-qn-accent"
            >
              Email
            </a>
          </div>
          <div className="flex flex-col gap-1 sm:items-end">
            <p className="text-xs text-qn-muted-2">
              © {new Date().getFullYear()} QR Netra. All rights reserved.
            </p>
            <p className="text-xs text-qn-muted-2">Built for India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
