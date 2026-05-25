import { FadeIn } from "@/components/ui/motion";
import { Check, Shield } from "lucide-react";
import Link from "next/link";
import { HeroPhoneMockup } from "./hero-phone-mockup";
import { HeroRotatingNotifications } from "./hero-rotating-notifications";
import { Section } from "./section";

const TRUST_PILLS = [
  "No app for finder",
  "2 min setup",
  "Works across India",
];

const FEATURES = [
  "Number stays private",
  "Physical safety products",
  "Fast QR activation",
  "Instant scan support",
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
            QR identity, safety, and recovery platform
          </span>
          <h1 className="qn-hero-title mt-6 text-white">
            Protect What Matters Most.
            <br />
            <span className="qn-gradient-headline">
              Kids • Pets • Vehicles • Belongings
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-qn-muted sm:text-lg">
            Smart QR safety stickers and tags for vehicles, pets, kids, and
            personal assets. Shop physical products first, then activate each
            one with QRNetra’s privacy-first recovery profile.
          </p>
          <p className="mt-4 text-sm text-qn-muted-2">
            {TRUST_PILLS.join(" • ")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/products" className="qn-btn-primary px-8">
              Shop QR Products →
            </Link>
            <Link href="/create" className="qn-btn-secondary px-8">
              Create Free QR
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

        <FadeIn
          delay={0.1}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <div className="relative aspect-square max-h-[520px] lg:ml-auto lg:mr-0">
            <HeroPhoneMockup />
            <HeroRotatingNotifications />
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
