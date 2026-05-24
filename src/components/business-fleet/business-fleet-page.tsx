import { BusinessFleetQuoteForm } from "@/components/business-fleet/business-fleet-quote-form";
import { FadeIn } from "@/components/ui/motion";
import { BUSINESS_FLEET_USE_CASES } from "@/lib/brand";
import {
  Building2,
  Headphones,
  IndianRupee,
  Layers,
  Shield,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/landing/section";

const BENEFITS = [
  {
    icon: Layers,
    title: "Mixed product catalog",
    desc: "Vehicle stickers, pet tags, wristbands, and keychains in one order.",
  },
  {
    icon: IndianRupee,
    title: "Volume pricing",
    desc: "Tiered rates, GST invoicing, and PO-friendly billing.",
  },
  {
    icon: Shield,
    title: "Admin controls",
    desc: "Role-based dashboard access, exports, and privacy policies.",
  },
  {
    icon: Headphones,
    title: "Dedicated onboarding",
    desc: "Implementation support for schools, RWAs, and fleets.",
  },
];

const PRICING_TIERS = [
  { range: "50 – 199", discount: "12% off retail", note: "Starter fleet" },
  { range: "200 – 999", discount: "22% off retail", note: "Growing orgs" },
  { range: "1,000+", discount: "Custom quote", note: "Enterprise SLA" },
];

const FAQ = [
  {
    q: "Can we mix vehicle, pet, and child products?",
    a: "Yes. Business orders can combine any QRNetra product types under one account and invoice.",
  },
  {
    q: "Do you support branded stickers?",
    a: "Custom branding, society logos, and fleet numbering are available on volume plans.",
  },
  {
    q: "How fast can we deploy?",
    a: "Digital profiles activate in minutes. Physical tags typically ship within 5–7 business days across India.",
  },
];

export function BusinessFleetPage() {
  return (
    <>
      <Section className="relative overflow-hidden" innerClassName="pb-8 pt-4 sm:pt-8">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <span className="qn-badge">Business & Fleet</span>
          <h1 className="qn-hero-title mt-6 text-white">
            QR safety at scale for organizations
          </h1>
          <p className="mt-6 text-base leading-relaxed text-qn-muted sm:text-lg">
            One partner for fleets, schools, housing societies, delivery networks,
            and corporate assets — with bulk pricing and admin tools built for
            India.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#quote" className="qn-btn-primary px-8">
              Request Bulk Pricing
            </a>
            <Link href="/contact" className="qn-btn-secondary px-8">
              Talk to sales
            </Link>
          </div>
        </FadeIn>
      </Section>

      <Section id="benefits" className="border-t border-white/[0.08] bg-qn-bg-elevated">
        <FadeIn className="text-center">
          <h2 className="qn-section-title text-white">Why teams choose QRNetra</h2>
        </FadeIn>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <FadeIn key={b.title} delay={i * 0.05}>
              <div className="qn-card h-full p-6">
                <b.icon className="h-6 w-6 text-qn-accent" strokeWidth={1.75} />
                <h3 className="mt-4 font-semibold text-white">{b.title}</h3>
                <p className="mt-2 text-sm text-qn-muted">{b.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section id="use-cases">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <FadeIn>
            <h2 className="qn-section-title text-white">Built for every scale</h2>
            <p className="mt-4 text-qn-muted">
              Whether you manage ten delivery bikes or ten thousand society
              vehicles, QRNetra keeps contact private and response instant.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {BUSINESS_FLEET_USE_CASES.map((u) => (
                <li
                  key={u}
                  className="qn-card flex items-center gap-2 px-4 py-3 text-sm font-medium text-white"
                >
                  <Truck className="h-4 w-4 shrink-0 text-qn-accent" />
                  {u}
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="qn-card p-6">
              <Building2 className="h-8 w-8 text-qn-accent" strokeWidth={1.75} />
              <p className="mt-4 text-sm text-qn-muted">
                Admin preview: bulk tag provisioning, scan analytics, and
                masked relay for every asset class.
              </p>
              <div className="mt-6 space-y-2">
                <div className="h-3 w-full rounded bg-white/10" />
                <div className="h-3 w-4/5 rounded bg-qn-accent/30" />
                <div className="h-20 rounded-xl bg-qn-surface" />
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section
        id="pricing"
        className="border-t border-white/[0.08] bg-qn-bg-deep"
      >
        <FadeIn className="text-center">
          <h2 className="qn-section-title text-white">Bulk pricing</h2>
          <p className="mx-auto mt-4 max-w-xl text-qn-muted">
            Transparent tiers — final quotes depend on product mix and branding.
          </p>
        </FadeIn>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PRICING_TIERS.map((tier, i) => (
            <FadeIn key={tier.range} delay={i * 0.05}>
              <div className="qn-card qn-card-interactive p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-qn-accent">
                  {tier.note}
                </p>
                <p className="mt-3 text-2xl font-extrabold text-white">
                  {tier.range} tags
                </p>
                <p className="mt-2 text-sm text-qn-muted">{tier.discount}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section id="quote">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="qn-section-title text-white">Request a quote</h2>
          <p className="mt-4 text-qn-muted">
            Tell us about your organization — we&apos;ll send a tailored proposal.
          </p>
        </FadeIn>
        <FadeIn delay={0.1} className="mx-auto mt-10 max-w-2xl">
          <BusinessFleetQuoteForm />
        </FadeIn>
      </Section>

      <Section
        id="faq"
        className="border-t border-white/[0.08] bg-qn-bg-elevated"
      >
        <FadeIn className="text-center">
          <h2 className="qn-section-title text-white">FAQ</h2>
        </FadeIn>
        <div className="qn-card mx-auto mt-10 max-w-2xl divide-y divide-white/[0.08]">
          {FAQ.map((item) => (
            <div key={item.q} className="px-6 py-5">
              <p className="font-semibold text-white">{item.q}</p>
              <p className="mt-2 text-sm text-qn-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
