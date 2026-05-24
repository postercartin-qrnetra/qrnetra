import { FadeIn } from "@/components/ui/motion";
import { Check, Shield } from "lucide-react";
import Link from "next/link";
import { Section } from "./section";

function QrPattern({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="64" height="64" rx="4" fill="#0a1227" />
      <rect x="6" y="6" width="18" height="18" rx="1" fill="#ff6b2c" />
      <rect x="40" y="6" width="18" height="18" rx="1" fill="#ff6b2c" />
      <rect x="6" y="40" width="18" height="18" rx="1" fill="#ff6b2c" />
      <rect x="28" y="28" width="8" height="8" fill="#94a3b8" />
      <rect x="40" y="28" width="6" height="6" fill="#94a3b8" />
      <rect x="28" y="40" width="6" height="6" fill="#94a3b8" />
      <rect x="48" y="40" width="10" height="10" fill="#94a3b8" />
      <rect x="40" y="48" width="6" height="6" fill="#ff6b2c" />
    </svg>
  );
}

function FloatingCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`qn-glass rounded-2xl p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

const TRUST = [
  "No app for finder",
  "2 min setup",
  "Works across India",
];

const FEATURES = [
  "Number stays private",
  "Delivered in 3-5 days",
  "Weatherproof",
  "Instant scan",
];

export function HeroSection() {
  return (
    <Section
      className="relative overflow-hidden"
      innerClassName="py-12 sm:py-16 lg:py-20"
    >
      <div
        className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-qn-accent/[0.08] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-3xl"
        aria-hidden
      />

      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <span className="qn-badge">
            <Shield className="h-3.5 w-3.5" strokeWidth={2} />
            India&apos;s #1 smart QR safety tag
          </span>
          <h1 className="qn-hero-title mt-6 text-white">
            They Can&apos;t Reach You.
            <br />
            <span className="qn-gradient-headline">Your QR Sticker Can.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-qn-muted sm:text-lg">
            Smart QR stickers and safety tags for vehicles, kids, pets, and
            emergencies — without exposing your phone number publicly.
          </p>
          <p className="mt-4 text-sm text-qn-muted-2">
            {TRUST.join(" • ")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/shop" className="qn-btn-primary px-8">
              Get Your Sticker — Starting ₹249 →
            </Link>
            <Link href="/create/type" className="qn-btn-secondary px-8">
              Try Free (Digital QR)
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {FEATURES.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 text-xs font-medium text-qn-muted"
              >
                <Check
                  className="h-3.5 w-3.5 text-qn-accent"
                  strokeWidth={2}
                />
                {t}
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-square max-h-[520px] lg:ml-auto lg:mr-0">
            <div className="absolute left-1/2 top-1/2 z-30 w-[52%] -translate-x-1/2 -translate-y-[42%]">
              <div className="rounded-[2rem] border-4 border-qn-surface-2 bg-qn-card p-1 shadow-2xl shadow-black/50">
                <div className="overflow-hidden rounded-[1.5rem] bg-qn-bg-deep">
                  <div className="flex h-6 items-center justify-center">
                    <span className="h-1 w-10 rounded-full bg-white/10" />
                  </div>
                  <div className="px-4 pb-6 pt-2">
                    <div className="relative flex flex-col items-center rounded-xl border border-white/[0.08] bg-qn-surface p-6">
                      <div className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                      <QrPattern className="h-28 w-28 rounded-lg" />
                      <p className="mt-4 text-center text-xs font-medium text-white">
                        Scan to contact owner
                      </p>
                      <p className="mt-1 text-center text-[10px] text-qn-muted">
                        Privacy-protected · Masked relay
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FloatingCard className="absolute -left-2 bottom-[22%] z-40 max-w-[200px] sm:left-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-qn-muted">
              Vehicle tag scanned
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              MG Road, Bengaluru
            </p>
            <p className="mt-1 text-xs text-qn-muted-2">2 min ago</p>
          </FloatingCard>

          <FloatingCard className="absolute -right-1 top-[20%] z-40 max-w-[180px] sm:right-0">
            <p className="text-[10px] font-semibold text-qn-success">
              Owner contacted
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-white">
              <Check className="h-4 w-4 text-qn-success" />
              Masked relay active
            </p>
          </FloatingCard>

          <FloatingCard className="absolute right-[6%] bottom-[8%] z-40 hidden max-w-[200px] sm:block">
            <p className="text-sm font-semibold text-white">Pet found · Bandra</p>
            <p className="mt-1 text-[11px] text-qn-muted">Finder notified owner</p>
          </FloatingCard>
        </FadeIn>
      </div>
    </Section>
  );
}
