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
      className="border-t border-zinc-100 bg-white"
    >
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Simple flow
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
          How QRNetra Works
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-600 sm:text-base">
          From purchase to emergency contact in four steps — engineered for
          clarity and speed.
        </p>
      </div>

      <div className="relative mt-14 lg:mt-16">
        <div
          className="pointer-events-none absolute left-0 right-0 top-[4.25rem] hidden h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent lg:block"
          aria-hidden
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="group relative rounded-2xl border border-zinc-200 bg-[#fafafa] p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-[#ffd400]">{s.n}</span>
                {i < STEPS.length - 1 ? (
                  <span
                    className="hidden text-zinc-300 lg:inline"
                    aria-hidden
                  >
                    →
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-[#111111]">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {s.desc}
              </p>
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#111111] text-[#ffd400] transition-transform duration-300 group-hover:scale-105">
                <span className="text-lg font-bold">{i + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
