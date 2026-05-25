import { BuyNowButton } from "@/components/products/buy-now-button";
import { ProductImagePanel } from "@/components/products/product-image-panel";
import { FadeIn } from "@/components/ui/motion";
import {
  getCategory,
  getCategoryLabel,
  getDiscountPercent,
  getPriceLabel,
  getRelatedProducts,
  isProductOnSale,
  type Product,
} from "@/lib/products";
import { Check, Shield, Star, Truck } from "lucide-react";
import Link from "next/link";

export function StoreProductDetailPage({ product }: { product: Product }) {
  const category = getCategory(product.category);
  const related = getRelatedProducts(product, 4);
  const discount = getDiscountPercent(product);

  return (
    <div className="min-h-screen">
      <div className="border-b border-white/[0.08] bg-qn-bg-elevated">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-qn-muted-2">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white">
              Products
            </Link>
            <span>/</span>
            <Link href={category.href} className="hover:text-white">
              {category.shortTitle}
            </Link>
            <span>/</span>
            <span className="text-white">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <FadeIn>
            <div className="space-y-4">
              <div className="relative">
                <ProductImagePanel product={product} className="aspect-square" />
                {discount ? (
                  <span className="absolute left-4 top-4 rounded-full bg-qn-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-qn-bg">
                    Save {discount}%
                  </span>
                ) : null}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[Shield, Truck, Star].map((Icon, idx) => (
                  <div key={idx} className="qn-card flex items-center justify-center p-4">
                    <Icon className="h-5 w-5 text-qn-accent" strokeWidth={1.75} />
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-xs font-semibold uppercase tracking-wide text-qn-accent">
              {getCategoryLabel(product.category)}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {product.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-qn-muted sm:text-lg">
              {product.description}
            </p>

            <div className="mt-5 flex items-center gap-4">
              <span className="inline-flex items-center gap-1 text-sm font-medium text-white">
                <Star className="h-4 w-4 fill-qn-accent text-qn-accent" strokeWidth={1.5} />
                {product.rating.toFixed(1)}
              </span>
              <span className="text-sm text-qn-muted">
                {product.reviewCount} customer reviews
              </span>
            </div>

            <div className="mt-6">
              <div className="flex items-end gap-3">
                <p className="text-3xl font-extrabold text-white">
                  {getPriceLabel(product)}
                </p>
                {isProductOnSale(product) ? (
                  <p className="pb-1 text-base text-qn-muted line-through">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-qn-muted">
                Stock available: {product.stock}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2 text-sm text-qn-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-qn-accent" strokeWidth={2} />
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BuyNowButton
                qrKind={product.profileKind}
                productSlug={product.slug}
                className="qn-btn-primary px-10"
              >
                Buy Now
              </BuyNowButton>
              <Link href="/cart" className="qn-btn-secondary px-8">
                Add To Cart
              </Link>
            </div>

            <div className="qn-card mt-8 p-5">
              <p className="text-sm font-semibold text-white">Why customers buy this</p>
              <ul className="mt-3 space-y-2">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="text-sm text-qn-muted">
                    • {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>

      <section className="border-t border-white/[0.08] bg-qn-bg-elevated py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-white">FAQ</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {product.faq.map((item) => (
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

      <section className="border-t border-white/[0.08] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-white">Related products</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/products/${item.category}/${item.slug}`}
                className="qn-card qn-card-interactive p-4"
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs text-qn-muted">{item.shortDescription}</p>
                <p className="mt-3 text-sm font-bold text-qn-accent">
                  {getPriceLabel(item)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
