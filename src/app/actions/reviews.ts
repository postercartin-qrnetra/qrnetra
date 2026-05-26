"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitProductReviewAction(input: {
  productSlug: string;
  rating: number;
  reviewTitle: string;
  reviewText: string;
}) {
  const supabase = await createClient();
  if (!supabase) {
    return { error: "Server configuration error." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in to submit a review." };
  }

  const rating = Math.max(1, Math.min(5, Math.round(input.rating)));
  if (!input.reviewTitle.trim()) {
    return { error: "Review title is required." };
  }
  if (!input.reviewText.trim()) {
    return { error: "Review text is required." };
  }

  const { data: productRow, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", input.productSlug)
    .single();

  if (productError || !productRow) {
    return { error: "Product not found." };
  }

  const { data: paidOrders } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productRow.id)
    .eq("payment_status", "paid")
    .order("created_at", { ascending: false });

  if (!paidOrders?.length) {
    return { error: "Reviews unlock after a paid order for this product." };
  }

  const orderIds = paidOrders.map((order) => order.id);
  const { data: existingReviews } = await supabase
    .from("product_reviews")
    .select("order_id")
    .in("order_id", orderIds);

  const reviewedOrderIds = new Set(
    (existingReviews ?? []).map((review) => review.order_id).filter(Boolean),
  );
  const eligibleOrder = paidOrders.find((order) => !reviewedOrderIds.has(order.id));

  if (!eligibleOrder) {
    return { error: "You have already reviewed your paid order for this product." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const reviewerName =
    profile?.display_name?.trim() ||
    user.email?.split("@")[0]?.trim() ||
    "Verified customer";

  const { error: insertError } = await supabase.from("product_reviews").insert({
    user_id: user.id,
    product_id: productRow.id,
    order_id: eligibleOrder.id,
    rating,
    review_title: input.reviewTitle.trim(),
    review_text: input.reviewText.trim(),
    reviewer_name: reviewerName,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  return { error: null };
}
