import { FadeIn } from "@/components/ui/motion";
import { Link2, Package, QrCode, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Section } from "./section";

const STEPS = [
  {
    n: "01",
    icon: QrCode,
    title: "Choose Product",
    desc: "Select a sticker, pet tag, wristband, or keychain that fits your need.",
    cta: null,
  },
  {
    n: "02",
    icon: Link2,
    title: "Create Profile",
    desc: "Fill in owner, pet, child, or vehicle details. Your number stays private.",
    cta: null,
  },
  {
    n: "03",
    icon: Package,
    title: "Receive Product",
    desc: "Weatherproof tag delivered to your door in 3–5 business days.",
    cta: null,
  },
  {
    n: "04",
    icon: ShieldCheck,
    title: "Activate & Protect",
    desc: "Attach your QR and go live instantly — anyone can scan, no app needed.",
    cta: null,
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
        <h2 className="qn-section-title mt-4 text-white">
          Ready in four steps
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-qn-muted">
          From choosing your product to being fully protected — it takes less
          than 10 minutes.
        </p>
      </FadeIn>

      <div className="relative mt-14 lg:mt-16">
        {/* connector line */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-[2.75rem] hidden h-px bg-gradient-to-r from-transparent via-qn-accent/20 to-transparent lg:block"
          aria-hidden
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeIn key={s.n} delay={i * 0.07}>
                <div className="qn-card qn-card-interactive group relative flex flex-col p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-qn-accent/30 bg-[rgba(255,107,44,0.12)] text-qn-accent transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <span className="mt-4 text-xs font-bold tracking-widest text-qn-accent">
                    {s.n}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-qn-muted">
                    {s.desc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      <FadeIn delay={0.2} className="mt-12 text-center">
        <Link href="/products" className="qn-btn-primary px-10">
          Browse Products →
        </Link>
      </FadeIn>
    </Section>
  );
}
