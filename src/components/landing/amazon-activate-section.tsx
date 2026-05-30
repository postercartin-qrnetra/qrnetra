import { Section } from "@/components/landing/section";
import { FadeIn } from "@/components/ui/motion";
import Link from "next/link";

export function AmazonActivateSection() {
  return (
    <Section className="border-y border-qn-accent/20 bg-qn-accent/5">
      <FadeIn className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-qn-accent">
          Physical tags
        </p>
        <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
          Already purchased from Amazon?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-qn-muted sm:text-base">
          Scan the QR on your product or enter your Tag ID to activate — no
          checkout required.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/activate" className="qn-btn-primary px-8">
            Activate your tag
          </Link>
          <Link href="/activation-guide" className="qn-btn-secondary px-6">
            Activation guide
          </Link>
        </div>
      </FadeIn>
    </Section>
  );
}
