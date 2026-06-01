import Link from "next/link";
import { HELP_SECTIONS } from "@/content/company/help";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center | QRNetra",
  description: "Activation, orders, product care, FAQ, and support for QRNetra tags.",
};

export default function HelpCenterPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <nav className="mb-6 text-sm text-qn-muted-2">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        {" / "}
        <span className="text-white">Help Center</span>
      </nav>
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Help Center</h1>
      <p className="mt-4 text-qn-muted">
        Find guides for activating your tag, tracking orders, and keeping your profile accurate.
      </p>
      <ul className="mt-10 space-y-4">
        {HELP_SECTIONS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="qn-card block p-5 transition hover:border-qn-accent/30"
            >
              <p className="font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-sm text-qn-muted">{item.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
