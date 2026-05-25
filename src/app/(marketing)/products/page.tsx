import { ProductCard } from "@/components/products/product-card";
import { FadeIn } from "@/components/ui/motion";
import { PRODUCT_CATEGORIES, PRODUCTS } from "@/lib/products";
import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/landing/section";

export const metadata: Metadata = {
  title: "Products — QR Safety Tags",
  description:
    "Vehicle stickers, pet tags, child wristbands, keychains, and fleet solutions. Privacy-first QR safety from ₹199.",
};

export default function ProductsPage() {
  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden border-b border-white/[0.08] bg-qn-bg-elevated">
        <div
          className="pointer-events-none absolute -right-32 top-0 h-72 w-72 rounded-full bg-qn-accent/[0.07] blur-3xl"
          aria-hidden
        />
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <FadeIn className="max-w-2xl">
            <nav className="mb-4 flex items-center gap-2 text-sm text-qn-muted-2">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-white">Products</span>
            </nav>
            <h1 className="qn-hero-title text-white">
              QR Safety Products
            </h1>
            <p className="mt-5 text-lg text-qn-muted">
              Choose the right tag for your vehicle, pet, child, or everyday
              carry — built for privacy, speed, and peace of mind.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* All products by category */}
      {PRODUCT_CATEGORIES.map((cat) => (
        <Section
          key={cat.slug}
          id={cat.slug}
          className="border-t border-white/[0.08]"
        >
          <FadeIn className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {cat.title}
            </h2>
            <Link
              href={`/products/${cat.slug}`}
              className="shrink-0 text-sm font-semibold text-qn-accent underline-offset-4 hover:underline"
            >
              View details →
            </Link>
          </FadeIn>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cat.products.map((product) => (
              <FadeIn key={product.slug} delay={0.05}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        </Section>
      ))}

      {/* Trust bar */}
      <section className="border-t border-white/[0.08] bg-qn-bg-deep py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-qn-muted">
            {[
              "🔒 Number stays private",
              "📦 Delivered in 3–5 days",
              "🌧️ Weatherproof materials",
              "⚡ Instant activation",
              "💳 COD available",
              "🇮🇳 Made for India",
            ].map((item) => (
              <span key={item} className="whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
