import Link from "next/link";
import { Section } from "./section";

const PRODUCTS = [
  {
    name: "Vehicle QR Sticker",
    price: "From ₹299",
    features: ["Weatherproof vinyl", "Masked contact", "Wrong parking ready"],
    badge: "Bestseller",
    gradient: "from-zinc-700 to-zinc-900",
  },
  {
    name: "Child Safety Wristband",
    price: "From ₹399",
    features: ["Soft silicone", "Medical fields", "School-safe ID"],
    badge: "Parent pick",
    gradient: "from-sky-600 to-sky-800",
  },
  {
    name: "Pet QR Tag",
    price: "From ₹249",
    features: ["Collar mount", "Lost mode ready", "Vet contacts"],
    badge: "Popular",
    gradient: "from-amber-600 to-orange-800",
  },
  {
    name: "Business / Fleet QR",
    price: "Custom",
    features: ["Bulk pricing", "Admin roles", "Branded tags"],
    badge: "B2B",
    gradient: "from-emerald-700 to-emerald-900",
  },
];

export function ProductsSection() {
  return (
    <Section id="products" className="bg-[#fafafa]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Shop
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
            Product Categories
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-sm font-semibold text-[#111111] underline-offset-4 hover:underline"
        >
          View all products →
        </Link>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p) => (
          <article
            key={p.name}
            className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={`relative aspect-[4/3] bg-gradient-to-br ${p.gradient} p-6`}
            >
              <span className="absolute right-3 top-3 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                {p.badge}
              </span>
              <div className="flex h-full items-center justify-center">
                <div className="h-24 w-24 rounded-2xl border-2 border-white/20 bg-white/10 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-semibold text-[#111111]">{p.name}</h3>
              <ul className="mt-3 flex-1 space-y-1.5">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-zinc-600"
                  >
                    <span
                      className="h-1 w-1 rounded-full bg-[#ffd400]"
                      aria-hidden
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-bold text-[#111111]">{p.price}</p>
              <Link
                href="/shop"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                Get started
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
