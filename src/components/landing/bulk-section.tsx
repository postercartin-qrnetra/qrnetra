import { FadeIn } from "@/components/ui/motion";
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
    <Section className="border-t border-white/[0.08]">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <FadeIn>
          <span className="qn-badge">Bulk & societies</span>
          <h2 className="qn-section-title mt-4 text-white">
            Branded QR at scale
          </h2>
          <p className="mt-4 text-base leading-relaxed text-qn-muted">
            Corporate programs with bulk discounts, dedicated onboarding, and
            admin dashboards for your teams.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {USES.map((u) => (
              <li
                key={u}
                className="qn-card flex items-center gap-2 px-4 py-3 text-sm font-medium text-white"
              >
                <span className="text-qn-accent" aria-hidden>
                  ✓
                </span>
                {u}
              </li>
            ))}
          </ul>
          <ul className="mt-6 space-y-2 text-sm text-qn-muted">
            <li>● Custom branded QR tags</li>
            <li>● Volume pricing & invoicing</li>
            <li>● Admin dashboard & exports</li>
          </ul>
          <Link href="/business-fleet" className="qn-btn-primary mt-8 px-8">
            Business & Fleet Solutions
          </Link>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="qn-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-qn-muted">
              Admin preview
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                <div className="h-10 flex-1 rounded-lg bg-qn-surface" />
                <div className="h-10 w-24 rounded-lg bg-qn-accent/30" />
              </div>
              <div className="rounded-xl border border-white/[0.08] p-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-16 flex-1 rounded-lg bg-qn-card-3"
                    />
                  ))}
                </div>
              </div>
              <div className="h-24 rounded-xl bg-qn-surface" />
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
