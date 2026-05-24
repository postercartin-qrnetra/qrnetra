import { FadeIn } from "@/components/ui/motion";
import { Section } from "./section";

const FEATURES = [
  "Dynamic QR Profiles",
  "Privacy-first Contact",
  "WhatsApp Integration",
  "Scan Analytics",
  "Emergency Mode",
  "Waterproof Tags",
  "Multi-device Access",
  "Real-time Updates",
  "Family Profiles",
  "Instant Activation",
];

function FeatureIcon({ index }: { index: number }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-qn-accent/30 bg-[rgba(255,107,44,0.12)] text-sm font-bold text-qn-accent">
      {index + 1}
    </div>
  );
}

export function FeaturesSection() {
  return (
    <Section id="features" className="border-t border-white/[0.08] bg-qn-bg-elevated">
      <FadeIn className="text-center">
        <span className="qn-badge">Platform</span>
        <h2 className="qn-section-title mt-4 text-white">
          Built for real emergencies
        </h2>
      </FadeIn>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {FEATURES.map((f, i) => (
          <FadeIn key={f} delay={i * 0.03}>
            <div className="qn-card qn-card-interactive p-5">
              <FeatureIcon index={i} />
              <p className="mt-4 text-sm font-semibold text-white">{f}</p>
              <p className="mt-1 text-xs leading-relaxed text-qn-muted">
                Enterprise-grade reliability for consumer safety.
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
