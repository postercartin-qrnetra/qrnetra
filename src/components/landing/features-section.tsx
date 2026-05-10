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
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#111111] text-sm font-bold text-[#ffd400]">
      {index + 1}
    </div>
  );
}

export function FeaturesSection() {
  return (
    <Section id="features" className="bg-[#fafafa]">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Platform
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
          Built for real emergencies
        </h2>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {FEATURES.map((f, i) => (
          <div
            key={f}
            className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-md"
          >
            <FeatureIcon index={i} />
            <p className="mt-4 text-sm font-semibold text-[#111111]">{f}</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              Enterprise-grade reliability for consumer safety.
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
