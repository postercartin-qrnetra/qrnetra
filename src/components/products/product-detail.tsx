import { BuyNowButton } from "@/components/products/buy-now-button";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { FadeIn } from "@/components/ui/motion";
import {
  getCategory,
  getCategoryLabel,
  getDiscountPercent,
  getPriceLabel,
  getRelatedProducts,
  isProductOnSale,
  type Product,
  type ProductReview,
} from "@/lib/products";
import { Check, ShieldCheck, Star, Truck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  product: Product;
  reviews?: ProductReview[];
  reviewCount?: number;
  averageRating?: number;
  reviewForm?: ReactNode;
};

function getRatingBreakdown(totalReviews: number, averageRating: number) {
  const weighted = [
    { stars: 5, ratio: Math.min(0.74, averageRating / 5) },
    { stars: 4, ratio: 0.18 },
    { stars: 3, ratio: 0.05 },
    { stars: 2, ratio: 0.02 },
    { stars: 1, ratio: 0.01 },
  ];

  return weighted.map((item) => ({
    ...item,
    count: Math.max(0, Math.round(totalReviews * item.ratio)),
  }));
}

export function ProductDetail({
  product,
  reviews = product.reviews,
  reviewCount = product.reviewCount,
  averageRating = product.rating,
  reviewForm,
}: Props) {
  const category = getCategory(product.category);
  const related = getRelatedProducts(product, 4);
  const discount = getDiscountPercent(product);
  const breakdown = getRatingBreakdown(reviewCount, averageRating);

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
            <ProductImageGallery product={product} />
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

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1 text-sm font-medium text-white">
                <Star className="h-4 w-4 fill-qn-accent text-qn-accent" strokeWidth={1.5} />
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-qn-muted">
                {reviewCount} customer reviews
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-qn-muted">
                <ShieldCheck className="h-4 w-4 text-qn-accent" strokeWidth={1.75} />
                Dashboard-linked permanent QR
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
              {discount ? (
                <p className="mt-1 text-sm text-qn-accent">Save {discount}% on this product</p>
              ) : null}
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

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "Permanent QR",
                  body: "Generate once, edit later forever from the dashboard.",
                },
                {
                  icon: Truck,
                  title: "Fast Delivery",
                  body: "Physical product ships after payment confirmation.",
                },
                {
                  icon: Star,
                  title: "Premium Print",
                  body: "Designed for repeat scans and everyday real-world use.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="qn-card p-4">
                    <Icon className="h-5 w-5 text-qn-accent" strokeWidth={1.75} />
                    <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-qn-muted">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </div>

      <section className="border-t border-white/[0.08] bg-qn-bg-elevated py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="qn-card p-6">
            <h2 className="text-xl font-extrabold text-white">Specifications</h2>
            <div className="mt-5 space-y-3">
              {product.specifications.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-3 last:border-b-0 last:pb-0"
                >
                  <span className="text-sm font-medium text-qn-muted">{item.label}</span>
                  <span className="text-right text-sm text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="qn-card p-6">
            <h2 className="text-xl font-extrabold text-white">Delivery Information</h2>
            <ul className="mt-5 space-y-3">
              {product.deliveryInfo.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-qn-muted">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-qn-accent" strokeWidth={1.75} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.08] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <div className="qn-card p-6">
              <h2 className="text-xl font-extrabold text-white">Rating Summary</h2>
              <div className="mt-5 flex items-end gap-3">
                <span className="text-4xl font-extrabold text-white">
                  {averageRating.toFixed(1)}
                </span>
                <span className="pb-1 text-sm text-qn-muted">out of 5</span>
              </div>
              <div className="mt-5 space-y-3">
                {breakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="w-12 text-sm text-qn-muted">{item.stars} star</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-full rounded-full bg-qn-accent"
                        style={{
                          width:
                            reviewCount > 0
                              ? `${Math.max(8, Math.round((item.count / reviewCount) * 100))}%`
                              : "0%",
                        }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm text-qn-muted">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-white">Customer Reviews</h2>
              {reviewForm}
              {reviews.map((review) => (
                <div key={`${review.reviewerName}-${review.title}`} className="qn-card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < review.rating
                                ? "fill-qn-accent text-qn-accent"
                                : "text-white/20"
                            }`}
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-lg font-semibold text-white">{review.title}</p>
                    </div>
                    <span className="text-sm text-qn-muted">{review.createdAt}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-qn-muted">{review.text}</p>
                  <p className="mt-4 text-sm font-medium text-white">
                    {review.reviewerName}
                    <span className="ml-2 text-qn-muted">{review.location}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
