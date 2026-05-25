import { FadeIn } from "@/components/ui/motion";
import Link from "next/link";
import { Section } from "./section";

const CATEGORIES = [
  {
    href: "/create/vehicle",
    emoji: "🚗",
    title: "Vehicles",
    description: "Wrong parking, emergencies, and quick owner contact.",
  },
  {
    href: "/create/kid",
    emoji: "👶",
    title: "Kids",
    description: "Parent contact, school info, and emergency notes.",
  },
  {
    href: "/create/pet",
    emoji: "🐾",
    title: "Pets",
    description: "Owner reachability, vet notes, and safe return details.",
  },
  {
    href: "/create/asset",
    emoji: "🎒",
    title: "Personal Assets",
    description: "Keys, bags, wallets, laptops, luggage, and more.",
  },
  {
    href: "/create/business",
    emoji: "🏢",
    title: "Business Profiles",
    description: "Shared assets, teams, and fleet escalation contacts.",
  },
];

export function FreeQrCategoriesSection() {
  return (
    <Section id="free-qr-categories" className="border-t border-white/[0.08]">
      <FadeIn className="text-center">
        <span className="qn-badge">Free QR categories</span>
        <h2 className="qn-section-title mt-4 text-white">
          Start free. Upgrade only when you need physical tags.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-qn-muted">
          Create a live QR profile for people, pets, vehicles, and belongings
          without checkout, payment, or product purchase.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {CATEGORIES.map((category, index) => (
          <FadeIn key={category.title} delay={index * 0.04}>
            <Link
              href={category.href}
              className="qn-card qn-card-interactive block h-full p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-qn-accent/25 bg-qn-accent/10 text-2xl">
                <span aria-hidden>{category.emoji}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {category.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-qn-muted">
                {category.description}
              </p>
              <span className="mt-4 inline-flex text-sm font-semibold text-qn-accent">
                Create free QR →
              </span>
            </Link>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
