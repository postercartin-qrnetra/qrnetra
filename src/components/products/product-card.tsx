import Link from "next/link";
import type { Product } from "@/lib/products";
import {
  getCategoryLabel,
  getDiscountPercent,
  getPriceLabel,
  getProductHref,
  isProductOnSale,
} from "@/lib/products";
import { Check, Star } from "lucide-react";
import { BuyNowButton } from "./buy-now-button";
import { ProductImagePanel } from "./product-image-panel";

type Props = {
  product: Product;
  compact?: boolean;
};

export function ProductCard({ product, compact = false }: Props) {
  const discount = getDiscountPercent(product);
  const productHref = getProductHref(product);

  return (
    <article className="qn-card qn-card-interactive flex flex-col overflow-hidden">
      <div className="relative p-3 pb-0">
        <ProductImagePanel
          product={product}
          className={compact ? "aspect-[4/3]" : "aspect-[4/3]"}
        />
        {discount ? (
          <span className="absolute left-5 top-5 rounded-full bg-qn-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-qn-bg">
            {discount}% off
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-qn-accent">
            {getCategoryLabel(product.category)}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            {product.title}
          </h3>
          <p className="mt-1.5 text-sm text-qn-muted">{product.shortDescription}</p>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-white">
            <Star className="h-4 w-4 fill-qn-accent text-qn-accent" strokeWidth={1.5} />
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-qn-muted">
            {product.reviewCount} reviews
          </span>
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
          <div className="flex items-end gap-2">
            <p className="text-xl font-extrabold text-white">{getPriceLabel(product)}</p>
            {isProductOnSale(product) ? (
              <p className="text-sm text-qn-muted line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-qn-muted">
            Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {product.stock > 0 ? (
            <BuyNowButton
              qrKind={product.profileKind}
              productSlug={product.slug}
              className="qn-btn-primary w-full"
            >
              Buy Now
            </BuyNowButton>
          ) : (
            <button className="qn-btn-primary w-full opacity-60" disabled>
              Out of Stock
            </button>
          )}
          {!compact ? (
            <Link
              href={productHref}
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
