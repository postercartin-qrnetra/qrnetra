import { FadeIn } from "@/components/ui/motion";
import { Star } from "lucide-react";
import { Section } from "./section";

const TESTIMONIALS = [
  {
    quote:
      "Finally a parking tag that doesn’t broadcast my number. Setup took under five minutes.",
    name: "Priya S.",
    role: "Vehicle owner, Mumbai",
    initials: "PS",
  },
  {
    quote:
      "The wristband gives us peace of mind at school events. Medical notes are there if needed.",
    name: "Rahul M.",
    role: "Parent, Bengaluru",
    initials: "RM",
  },
  {
    quote:
      "Our society is piloting fleet stickers for delivery partners. Support has been excellent.",
    name: "Anita K.",
    role: "RWA secretary, Pune",
    initials: "AK",
  },
];

const STATS = [
  { value: "100K+", label: "Users" },
  { value: "1M+", label: "Scans" },
  { value: "98%", label: "Satisfaction" },
  { value: "24/7", label: "Emergency access" },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-qn-accent" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
      ))}
    </div>
  );
}

export function SocialSection() {
  return (
    <Section className="border-t border-white/[0.08] bg-qn-bg-deep">
      <FadeIn className="text-center">
        <span className="qn-badge">Social proof</span>
        <h2 className="qn-section-title mt-4 text-white">Trusted by thousands</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-qn-muted">
          Real families and fleets rely on QRNetra when contact speed and
          privacy both matter.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <FadeIn key={t.name} delay={i * 0.05}>
            <blockquote className="qn-card flex flex-col p-6">
              <Stars />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-qn-muted">
                “{t.quote}”
              </p>
              <footer className="mt-6 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-qn-accent/30 bg-[rgba(255,107,44,0.12)] text-xs font-bold text-qn-accent"
                  aria-hidden
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-qn-muted-2">{t.role}</p>
                </div>
              </footer>
            </blockquote>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.15} className="qn-card mt-16 grid grid-cols-2 gap-6 border-qn-accent/20 bg-qn-card-2 px-6 py-10 sm:grid-cols-4 sm:gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-extrabold text-qn-accent sm:text-3xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-qn-muted">
              {s.label}
            </p>
          </div>
        ))}
      </FadeIn>
    </Section>
  );
}
