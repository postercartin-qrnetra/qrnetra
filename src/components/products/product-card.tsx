import Link from "next/link";
import type { Product } from "@/lib/products";
import { Check } from "lucide-react";
import { BuyNowButton } from "./buy-now-button";
import { ProfileTypeContinueButton } from "@/components/onboarding/profile-type-continue-button";

type Props = {
  product: Product;
  compact?: boolean;
};

export function ProductCard({ product, compact = false }: Props) {
  return (
    <article className="qn-card qn-card-interactive flex flex-col overflow-hidden">
      {/* Visual area */}
      <div
        className={`relative bg-gradient-to-br ${product.gradientFrom} ${product.gradientTo} flex items-center justify-center ${compact ? "h-32" : "h-44"}`}
      >
        {product.badge ? (
          <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
            {product.badge}
          </span>
        ) : null}
        <span className={compact ? "text-5xl" : "text-6xl"} aria-hidden>
          {product.emoji}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-qn-accent">
            {product.category}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            {product.name}
          </h3>
          <p className="mt-1.5 text-sm text-qn-muted">{product.tagline}</p>
        </div>

        {!compact ? (
          <ul className="mt-4 flex-1 space-y-1.5">
            {product.features.slice(0, 4).map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-qn-muted">
                <Check className="h-3.5 w-3.5 shrink-0 text-qn-accent" strokeWidth={2} />
                {f}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5">
          <p className="text-xl font-extrabold text-white">
            {product.priceLabel}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {product.qrKind ? (
            <BuyNowButton
              qrKind={product.qrKind}
              productSlug={product.slug}
              className="qn-btn-primary w-full"
            >
              Buy Now
            </BuyNowButton>
          ) : (
            <Link
              href="/business-fleet"
              className="qn-btn-primary w-full text-center"
            >
              Get a Quote
            </Link>
          )}
          {!compact && product.qrKind ? (
            <Link
              href={`/products/${product.slug}`}
              className="qn-btn-secondary w-full text-center text-sm"
            >
              View Details
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
