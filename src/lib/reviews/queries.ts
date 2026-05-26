import type { Product, ProductReview } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import { createPublicServerClient } from "@/lib/supabase/public-server";

type ReviewRow = {
  rating: number;
  review_title: string;
  review_text: string;
  reviewer_name: string;
  created_at: string;
};

export async function getProductReviewSnapshot(product: Product): Promise<{
  averageRating: number;
  reviewCount: number;
  reviews: ProductReview[];
}> {
  const supabase = createPublicServerClient();
  if (!supabase) {
    return {
      averageRating: product.rating,
      reviewCount: product.reviewCount,
      reviews: product.reviews,
    };
  }

  const { data: productRow } = await supabase
    .from("products")
    .select("id")
    .eq("slug", product.slug)
    .maybeSingle();

  if (!productRow?.id) {
    return {
      averageRating: product.rating,
      reviewCount: product.reviewCount,
      reviews: product.reviews,
    };
  }

  const { data: reviewRows, error, count } = await supabase
    .from("product_reviews")
    .select("rating, review_title, review_text, reviewer_name, created_at", {
      count: "exact",
    })
    .eq("product_id", productRow.id)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error || !reviewRows?.length) {
    return {
      averageRating: product.rating,
      reviewCount: product.reviewCount,
      reviews: product.reviews,
    };
  }

  const rows = reviewRows as ReviewRow[];
  const average =
    rows.reduce((sum, review) => sum + review.rating, 0) / rows.length;

  return {
    averageRating: Number(average.toFixed(1)),
    reviewCount: count ?? rows.length,
    reviews: rows.map((review) => ({
      rating: review.rating,
      title: review.review_title,
      text: review.review_text,
      reviewerName: review.reviewer_name,
      location: "Verified customer",
      createdAt: new Date(review.created_at).toLocaleDateString("en-IN"),
    })),
  };
}

export async function getReviewEligibility(productSlug: string) {
  const supabase = await createClient();
  if (!supabase) {
    return { canReview: false, reason: "Sign in to review this product." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { canReview: false, reason: "Sign in to review this product." };
  }

  const { data: productRow } = await supabase
    .from("products")
    .select("id")
    .eq("slug", productSlug)
    .maybeSingle();

  if (!productRow?.id) {
    return { canReview: false, reason: "Product is not ready for reviews yet." };
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productRow.id)
    .eq("payment_status", "paid")
    .order("created_at", { ascending: false });

  if (!orders?.length) {
    return {
      canReview: false,
      reason: "Reviews unlock after you complete a paid order for this product.",
    };
  }

  const orderIds = orders.map((order) => order.id);
  const { data: existingReviews } = await supabase
    .from("product_reviews")
    .select("order_id")
    .in("order_id", orderIds);

  const reviewedOrderIds = new Set(
    (existingReviews ?? []).map((review) => review.order_id).filter(Boolean),
  );
  const hasEligibleOrder = orders.some((order) => !reviewedOrderIds.has(order.id));

  return hasEligibleOrder
    ? { canReview: true, reason: null }
    : {
        canReview: false,
        reason: "You have already reviewed your paid order for this product.",
      };
}
