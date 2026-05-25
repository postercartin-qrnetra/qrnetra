import { ProductCard } from "@/components/products/product-card";
import { FadeIn } from "@/components/ui/motion";
import {
  getCategory,
  getProductsByCategory,
  type ProductPrimaryCategory,
} from "@/lib/products";
import Link from "next/link";

export function StoreCategoryPage({
  category,
}: {
  category: ProductPrimaryCategory;
}) {
  const meta = getCategory(category);
  const products = getProductsByCategory(category);

  return (
    <div className="min-h-screen">
      <section className="border-b border-white/[0.08] bg-qn-bg-elevated">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <FadeIn className="max-w-3xl">
            <nav className="mb-4 flex items-center gap-2 text-sm text-qn-muted-2">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-white">
                Products
              </Link>
              <span>/</span>
              <span className="text-white">{meta.shortTitle}</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-wide text-qn-accent">
              {meta.shortTitle} collection
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {meta.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-qn-muted sm:text-lg">
              {meta.description}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-white/[0.08] bg-qn-bg-deep py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {meta.benefits.map((benefit) => (
              <div key={benefit} className="qn-card p-5 text-sm text-qn-muted">
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <FadeIn key={product.slug} delay={index * 0.04}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-t border-white/[0.08] bg-qn-bg-elevated py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-qn-accent">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              Questions about {meta.shortTitle.toLowerCase()} products
            </h2>
          </FadeIn>

          <div className="mt-8 space-y-4">
            {meta.faq.map((item) => (
              <div key={item.question} className="qn-card p-5">
                <p className="text-sm font-semibold text-white">{item.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-qn-muted">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
