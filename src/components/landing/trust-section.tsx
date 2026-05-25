import { FadeIn } from "@/components/ui/motion";
import {
  IndianRupee,
  Lock,
  MapPin,
  PackageCheck,
  Scan,
  Smartphone,
} from "lucide-react";

const SIGNALS = [
  {
    icon: Lock,
    title: "Phone Number Stays Private",
    desc: "Your number is never visible on the public scan page.",
  },
  {
    icon: Smartphone,
    title: "No App Required",
    desc: "Finders scan with any phone camera — zero installs.",
  },
  {
    icon: MapPin,
    title: "Works Across India",
    desc: "Every scan routed securely from any corner of the country.",
  },
  {
    icon: PackageCheck,
    title: "Waterproof Products",
    desc: "Weatherproof materials rated for vehicles, outdoors, and pets.",
  },
  {
    icon: IndianRupee,
    title: "Fast Delivery",
    desc: "Delivered to your door in 3–5 business days. COD available.",
  },
  {
    icon: Scan,
    title: "Instant QR Activation",
    desc: "Go live the moment your profile is saved — before the tag even arrives.",
  },
];

export function TrustSection() {
  return (
    <section className="border-t border-white/[0.08] bg-qn-bg">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <FadeIn className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-qn-accent">
            Why QRNetra
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Built for privacy, speed, and peace of mind
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNALS.map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeIn key={s.title} delay={i * 0.04}>
                <div className="qn-card flex gap-4 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-qn-accent/25 bg-[rgba(255,107,44,0.1)] text-qn-accent">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {s.title}
                    </p>
                    <p className="mt-1 text-sm text-qn-muted">{s.desc}</p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
