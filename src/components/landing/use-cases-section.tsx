import { FadeIn } from "@/components/ui/motion";
import Link from "next/link";
import { Section } from "./section";

const VEHICLE_POINTS = [
  "Secure masked contact",
  "WhatsApp alert",
  "Emergency call option",
  "No number exposed publicly",
  "Instant scan access",
  "Dynamic profile editing",
];

export function VehicleUseCaseSection() {
  return (
    <Section className="border-t border-white/[0.08]">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <FadeIn className="relative order-2 lg:order-1">
          <div className="qn-card mx-auto max-w-md p-8">
            <div className="aspect-[3/4] rounded-2xl bg-gradient-to-b from-qn-surface-2 to-qn-bg-deep p-6 shadow-inner">
              <div className="flex h-full flex-col justify-between rounded-xl border border-white/[0.1] bg-white/5 p-4">
                <div className="flex justify-center">
                  <div className="h-32 w-32 rounded-xl bg-qn-card-3 p-2 shadow-lg">
                    <div className="h-full w-full rounded-md bg-qn-accent/20" />
                  </div>
                </div>
                <p className="text-center text-xs font-semibold uppercase tracking-wider text-qn-accent">
                  Scan to contact owner
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.1} className="order-1 lg:order-2">
          <span className="qn-badge">Vehicle</span>
          <h2 className="qn-section-title mt-4 text-white">
            Wrong Parking? Solve It In Seconds.
          </h2>
          <ul className="mt-8 space-y-3">
            {VEHICLE_POINTS.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-qn-muted">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-qn-accent"
                  aria-hidden
                />
                {t}
              </li>
            ))}
          </ul>
          <Link href="/activate" className="qn-btn-primary mt-8 px-8">
            Activate Your Tag
          </Link>
        </FadeIn>
      </div>
    </Section>
  );
}

export function ChildUseCaseSection() {
  return (
    <Section className="border-t border-white/[0.08] bg-qn-bg-elevated">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <FadeIn>
          <span className="qn-badge">Child safety</span>
          <h2 className="qn-section-title mt-4 text-white">
            Wristbands parents trust.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-qn-muted">
            Medical info access, SOS support, and a calm dashboard for
            guardians — school-safe branding without loud alarms.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-qn-muted">
            <li className="flex gap-2">
              <span className="text-qn-accent" aria-hidden>
                ●
              </span>
              Parent emergency dashboard
            </li>
            <li className="flex gap-2">
              <span className="text-qn-accent" aria-hidden>
                ●
              </span>
              Controlled medical visibility
            </li>
            <li className="flex gap-2">
              <span className="text-qn-accent" aria-hidden>
                ●
              </span>
              Soft, kid-friendly materials
            </li>
          </ul>
        </FadeIn>
        <FadeIn delay={0.1} className="relative mx-auto w-full max-w-md">
          <div className="qn-card p-8">
            <div className="flex flex-col items-center">
              <div className="flex h-40 w-16 items-end justify-center rounded-full border-4 border-white/[0.12] bg-qn-surface shadow-inner">
                <div className="mb-4 h-12 w-12 rounded-lg bg-qn-accent/30" />
              </div>
              <p className="mt-4 text-center text-xs font-medium text-qn-muted">
                Parent view: live status & contacts
              </p>
              <div className="qn-card mt-4 w-full p-4">
                <div className="h-2 w-1/3 rounded bg-white/10" />
                <div className="mt-3 h-8 w-full rounded-lg bg-qn-accent/20" />
                <div className="mt-2 h-8 w-full rounded-lg bg-qn-surface" />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

export function PetUseCaseSection() {
  return (
    <Section className="border-t border-white/[0.08]">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <FadeIn className="order-2 lg:order-1">
          <div className="qn-card mx-auto max-w-md p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-qn-accent/15 text-4xl">
                🐕
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded bg-white/10" />
                <div className="h-3 w-1/2 rounded bg-white/5" />
                <div className="mt-2 inline-flex rounded-full bg-qn-success/15 px-2 py-0.5 text-[10px] font-semibold text-qn-success">
                  Owner notified
                </div>
              </div>
            </div>
            <div className="qn-card mt-6 p-4">
              <p className="text-xs font-semibold text-qn-muted">Recovery flow</p>
              <p className="mt-1 text-sm text-qn-muted">
                Scan → profile → one-tap WhatsApp or call relay
              </p>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.1} className="order-1 lg:order-2">
          <span className="qn-badge">Pets</span>
          <h2 className="qn-section-title mt-4 text-white">
            Lost pet recovery, simplified.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-qn-muted">
            Collar-mounted QR, vaccination details on your terms, and instant
            owner contact when every minute counts.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-qn-muted">
            <li>● QR on collar — durable & visible</li>
            <li>● Vaccination & vet fields (privacy toggles)</li>
            <li>● One-tap owner contact for finders</li>
          </ul>
          <Link
            href="/shop"
            className="mt-6 inline-flex text-sm font-semibold text-qn-accent underline-offset-4 hover:underline"
          >
            Shop pet tags →
          </Link>
        </FadeIn>
      </div>
    </Section>
  );
}
