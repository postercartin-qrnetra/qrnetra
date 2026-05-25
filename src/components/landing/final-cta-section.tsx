import { FadeIn } from "@/components/ui/motion";
import { Package, Shield, Zap } from "lucide-react";
import Link from "next/link";

const TRUST = [
  { icon: Shield, label: "No subscription" },
  { icon: Package, label: "Delivered to your door" },
  { icon: Zap, label: "Active in minutes" },
];

export function FinalCtaSection() {
  return (
    <section className="scroll-mt-28 pb-16 pt-4 sm:pb-20">
      <FadeIn className="relative mx-4 overflow-hidden rounded-[20px] bg-qn-accent px-6 py-14 text-center sm:mx-6 sm:py-20 lg:mx-auto lg:max-w-7xl">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <h2 className="relative qn-section-title text-white">
          Start free today. Add physical QR products when you&apos;re ready.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-sm text-white/90 sm:text-base">
          QRNetra works without a purchase. Create a live QR profile first, then
          shop stickers, tags, or NFC upgrades whenever you need them.
        </p>
        <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/create" className="qn-btn-inverse min-w-[200px]">
            Create Free QR →
          </Link>
          <Link
            href="/products"
            className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full border-2 border-white/80 px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Shop QR Products
          </Link>
        </div>
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/90">
          {TRUST.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-2">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </span>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
