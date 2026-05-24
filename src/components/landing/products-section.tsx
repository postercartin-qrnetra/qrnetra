"use client";

import Link from "next/link";
import { ProfileTypeContinueButton } from "@/components/onboarding/profile-type-continue-button";
import { FadeIn } from "@/components/ui/motion";
import type { QrKind } from "@/lib/qr/types";
import { Section } from "./section";

const PRODUCTS: {
  name: string;
  type: QrKind;
  price: string;
  features: string[];
  badge: string;
  gradient: string;
}[] = [
  {
    name: "Vehicle QR Sticker",
    type: "vehicle",
    price: "From ₹299",
    features: ["Weatherproof vinyl", "Masked contact", "Wrong parking ready"],
    badge: "Bestseller",
    gradient: "from-qn-surface-2 to-qn-card-3",
  },
  {
    name: "Child Safety Wristband",
    type: "child",
    price: "From ₹399",
    features: ["Soft silicone", "Medical fields", "School-safe ID"],
    badge: "Parent pick",
    gradient: "from-slate-800 to-qn-card-3",
  },
  {
    name: "Pet QR Tag",
    type: "pet",
    price: "From ₹249",
    features: ["Collar mount", "Lost mode ready", "Vet contacts"],
    badge: "Popular",
    gradient: "from-qn-card-2 to-qn-accent/40",
  },
  {
    name: "Business / Fleet QR",
    type: "business",
    price: "Custom",
    features: ["Bulk pricing", "Admin roles", "Branded tags"],
    badge: "B2B",
    gradient: "from-emerald-950 to-qn-card-3",
  },
];

export function ProductsSection() {
  return (
    <Section id="products" className="border-t border-white/[0.08]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="qn-badge">Shop</span>
          <h2 className="qn-section-title mt-4 text-white">
            Product Categories
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-sm font-semibold text-qn-accent underline-offset-4 hover:underline"
        >
          View all products →
        </Link>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p, i) => (
          <FadeIn key={p.name} delay={i * 0.05}>
            <article className="qn-card qn-card-interactive flex flex-col overflow-hidden">
              <div
                className={`relative aspect-[4/3] bg-gradient-to-br ${p.gradient} p-6`}
              >
                <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                  {p.badge}
                </span>
                <div className="flex h-full items-center justify-center">
                  <div className="h-24 w-24 rounded-2xl border border-white/15 bg-white/5 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-105" />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-qn-muted"
                    >
                      <span
                        className="h-1 w-1 rounded-full bg-qn-accent"
                        aria-hidden
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-bold text-white">{p.price}</p>
                <ProfileTypeContinueButton
                  type={p.type}
                  className="qn-btn-primary mt-4 w-full"
                >
                  Get started
                </ProfileTypeContinueButton>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
