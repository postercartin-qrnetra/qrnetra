"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/motion";
import { ChevronDown } from "lucide-react";
import { Section } from "./section";

const FAQS = [
  {
    q: "Does QRNetra expose my number?",
    a: "Your public tag page never shows your raw phone number by default. Contact goes through masked relay and channels you enable, like WhatsApp or a bridged call.",
  },
  {
    q: "Does it require an app?",
    a: "Finders only need a phone camera — no app install. You manage tags in the web dashboard (and optional mobile apps when available).",
  },
  {
    q: "Can I update details later?",
    a: "Yes. Profiles are dynamic. Change contacts, medical notes, or visibility anytime — the QR URL stays the same.",
  },
  {
    q: "Is it waterproof?",
    a: "Our vehicle and outdoor tags use weatherproof materials. Specific IP ratings are listed on each product page.",
  },
  {
    q: "What happens during emergency scans?",
    a: "You get notified through your chosen channels. The finder sees only what you allow — designed for speed and privacy.",
  },
  {
    q: "Can family members manage tags?",
    a: "Family and team access is supported with role-friendly controls so the right people can edit or view safely.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section className="border-t border-white/[0.08] bg-qn-bg-elevated">
      <FadeIn className="mx-auto max-w-3xl text-center">
        <span className="qn-badge">FAQ</span>
        <h2 className="qn-section-title mt-4 text-white">Questions, answered</h2>
      </FadeIn>

      <div className="qn-card mx-auto mt-12 max-w-3xl divide-y divide-white/[0.08] px-2">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="px-4 py-1">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-white sm:text-base">
                  {item.q}
                </span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.12] text-qn-muted transition-transform ${
                    isOpen ? "rotate-180 bg-white/[0.05]" : ""
                  }`}
                  aria-hidden
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
              {isOpen ? (
                <p className="pb-4 text-sm leading-relaxed text-qn-muted">
                  {item.a}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
