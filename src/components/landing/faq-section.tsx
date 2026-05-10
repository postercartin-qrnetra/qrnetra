"use client";

import { useState } from "react";
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
    <Section className="bg-[#fafafa]">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          FAQ
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
          Questions, answered
        </h2>
      </div>

      <div className="mx-auto mt-12 max-w-3xl divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white px-2 shadow-sm">
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
                <span className="text-sm font-semibold text-[#111111] sm:text-base">
                  {item.q}
                </span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-transform ${
                    isOpen ? "rotate-180 bg-zinc-50" : ""
                  }`}
                  aria-hidden
                >
                  ⌄
                </span>
              </button>
              {isOpen ? (
                <p className="pb-4 text-sm leading-relaxed text-zinc-600">
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
