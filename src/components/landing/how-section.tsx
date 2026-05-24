import { FadeIn } from "@/components/ui/motion";
import { Section } from "./section";

const STEPS = [
  {
    n: "01",
    title: "Buy QR tag",
    desc: "Choose vehicle, child, pet, or fleet tags. Fast checkout with COD options.",
  },
  {
    n: "02",
    title: "Scan QR",
    desc: "Anyone scans with a phone camera — no app required for finders.",
  },
  {
    n: "03",
    title: "Setup emergency profile",
    desc: "Add contacts, medical notes, and privacy rules in your dashboard.",
  },
  {
    n: "04",
    title: "Receive instant contact",
    desc: "Masked calls, WhatsApp, and alerts when your tag is scanned.",
  },
];

export function HowSection() {
  return (
    <Section
      id="how-it-works"
      className="border-t border-white/[0.08] bg-qn-bg-deep"
    >
      <FadeIn className="text-center">
        <span className="qn-badge">Simple flow</span>
        <h2 className="qn-section-title mt-4 text-white">How QRNetra Works</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-qn-muted">
          From purchase to emergency contact in four steps — engineered for
          clarity and speed.
        </p>
      </FadeIn>

      <div className="relative mt-14 lg:mt-16">
        <div
          className="pointer-events-none absolute left-0 right-0 top-[4.25rem] hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block"
          aria-hidden
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.05}>
              <div className="qn-card qn-card-interactive group relative p-6">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-qn-accent">{s.n}</span>
                  {i < STEPS.length - 1 ? (
                    <span
                      className="hidden text-qn-muted-2 lg:inline"
                      aria-hidden
                    >
                      →
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-qn-muted">
                  {s.desc}
                </p>
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl border border-qn-accent/30 bg-[rgba(255,107,44,0.12)] text-qn-accent transition-transform duration-300 group-hover:scale-105">
                  <span className="text-lg font-bold">{i + 1}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}
