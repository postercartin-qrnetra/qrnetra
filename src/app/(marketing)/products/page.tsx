import { ProductCard } from "@/components/products/product-card";
import { FadeIn } from "@/components/ui/motion";
import { PRODUCT_CATEGORIES, getFeaturedProducts } from "@/lib/products";
import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/landing/section";

export const metadata: Metadata = {
  title: "Products — QR Safety Tags",
  description:
    "Shop QR safety products across Vehicles, Pets, Kids, and Assets. Privacy-first physical products backed by QRNetra profiles.",
};

export default function ProductsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/[0.08] bg-qn-bg-elevated">
        <div
          className="pointer-events-none absolute -right-32 top-0 h-72 w-72 rounded-full bg-qn-accent/[0.07] blur-3xl"
          aria-hidden
        />
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <FadeIn className="max-w-2xl">
            <nav className="mb-4 flex items-center gap-2 text-sm text-qn-muted-2">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span>/</span>
              <span className="text-white">Products</span>
            </nav>
            <h1 className="qn-hero-title text-white">
              Shop QR Safety Products
            </h1>
            <p className="mt-5 text-lg text-qn-muted">
              Explore category-first collections for vehicles, pets, kids, and
              personal assets. Built to convert visitors into customers without
              disturbing the existing QR platform.
            </p>
          </FadeIn>
        </div>
      </section>

      <Section className="border-t border-white/[0.08]">
        <FadeIn className="text-center">
          <span className="qn-badge">Primary categories</span>
          <h2 className="qn-section-title mt-4 text-white">
            Start with the collection that matches your use case
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {PRODUCT_CATEGORIES.map((category, index) => (
            <FadeIn key={category.key} delay={index * 0.04}>
              <Link
                href={category.href}
                className="qn-card qn-card-interactive block h-full p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-qn-accent">
                  {category.shortTitle}
                </p>
                <h3 className="mt-2 text-xl font-bold text-white">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-qn-muted">
                  {category.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {category.benefits.slice(0, 3).map((benefit) => (
                    <li key={benefit} className="text-sm text-qn-muted">
                      • {benefit}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex text-sm font-semibold text-qn-accent">
                  Explore collection →
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      {PRODUCT_CATEGORIES.map((category) => {
        const featured = getFeaturedProducts(category.key);
        return (
          <Section
            key={category.key}
            id={category.key}
            className="border-t border-white/[0.08]"
          >
            <FadeIn className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-qn-accent">
                  Featured in {category.shortTitle}
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {category.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-qn-muted">
                  {category.description}
                </p>
              </div>
              <Link
                href={category.href}
                className="shrink-0 text-sm font-semibold text-qn-accent underline-offset-4 hover:underline"
              >
                Shop all →
              </Link>
            </FadeIn>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product, index) => (
                <FadeIn key={product.slug} delay={index * 0.05}>
                  <ProductCard product={product} />
                </FadeIn>
              ))}
            </div>
          </Section>
        );
      })}

      <section className="border-t border-white/[0.08] bg-qn-bg-deep py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-qn-muted">
            {[
              "Secure product-linked QR setup",
              "Guest checkout supported",
              "Fast shipping across India",
              "Easy reorder and replacement flow",
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
