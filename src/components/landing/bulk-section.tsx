import Link from "next/link";
import { Section } from "./section";

const USES = [
  "Apartments & RWAs",
  "Schools",
  "Fleets",
  "Delivery companies",
  "Parking management",
];

export function BulkSection() {
  return (
    <Section className="bg-gradient-to-b from-zinc-100/80 to-white">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Bulk & societies
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
            Branded QR at scale
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
            Corporate programs with bulk discounts, dedicated onboarding, and
            admin dashboards for your teams.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {USES.map((u) => (
              <li
                key={u}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm"
              >
                <span className="text-[#ffd400]" aria-hidden>
                  ✓
                </span>
                {u}
              </li>
            ))}
          </ul>
          <ul className="mt-6 space-y-2 text-sm text-zinc-600">
            <li>● Custom branded QR tags</li>
            <li>● Volume pricing & invoicing</li>
            <li>● Admin dashboard & exports</li>
          </ul>
          <Link
            href="/bulk-orders"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#111111] px-8 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            Request Bulk Demo
          </Link>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Admin preview
          </p>
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <div className="h-10 flex-1 rounded-lg bg-zinc-100" />
              <div className="h-10 w-24 rounded-lg bg-[#ffd400]/40" />
            </div>
            <div className="rounded-xl border border-zinc-100 p-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 flex-1 rounded-lg bg-zinc-50" />
                ))}
              </div>
            </div>
            <div className="h-24 rounded-xl bg-[#fafafa]" />
          </div>
        </div>
      </div>
    </Section>
  );
}
