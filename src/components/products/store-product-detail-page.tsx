import { ProductDetail } from "@/components/products/product-detail";
import { ProductReviewForm } from "@/components/products/product-review-form";
import type { Product } from "@/lib/products";
import {
  getProductReviewSnapshot,
  getReviewEligibility,
} from "@/lib/reviews/queries";

export async function StoreProductDetailPage({ product }: { product: Product }) {
  const [snapshot, eligibility] = await Promise.all([
    getProductReviewSnapshot(product),
    getReviewEligibility(product.slug),
  ]);

  return (
    <ProductDetail
      product={product}
      reviews={snapshot.reviews}
      reviewCount={snapshot.reviewCount}
      averageRating={snapshot.averageRating}
      reviewForm={
        <ProductReviewForm
          productSlug={product.slug}
          canReview={eligibility.canReview}
          reason={eligibility.reason}
        />
      }
    />
  );
}
