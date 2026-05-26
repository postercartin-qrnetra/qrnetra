"use client";

import { submitProductReviewAction } from "@/app/actions/reviews";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductReviewForm({
  productSlug,
  canReview,
  reason,
}: {
  productSlug: string;
  canReview: boolean;
  reason: string | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(reason);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canReview) {
      return;
    }

    setLoading(true);
    setMessage(null);
    const result = await submitProductReviewAction({
      productSlug,
      rating,
      reviewTitle,
      reviewText,
    });
    setLoading(false);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    setReviewTitle("");
    setReviewText("");
    setMessage("Thanks for your review. It is now visible on this product page.");
    router.refresh();
  }

  return (
    <div className="qn-card p-6">
      <h3 className="text-lg font-semibold text-white">Write a review</h3>
      <p className="mt-2 text-sm text-qn-muted">
        Reviews are limited to paid customers and one review per purchased order.
      </p>

      <form onSubmit={(event) => void handleSubmit(event)} className="mt-5 space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-white">Rating</span>
          <select
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            disabled={!canReview || loading}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-card px-4 py-3 text-white outline-none focus:border-qn-accent/50 focus:ring-2 focus:ring-qn-accent/30"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} star{value > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-white">Title</span>
          <input
            value={reviewTitle}
            onChange={(event) => setReviewTitle(event.target.value)}
            disabled={!canReview || loading}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-card px-4 py-3 text-white outline-none placeholder:text-qn-muted-2 focus:border-qn-accent/50 focus:ring-2 focus:ring-qn-accent/30"
            placeholder="What stood out about this product?"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-white">Review</span>
          <textarea
            rows={4}
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            disabled={!canReview || loading}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-card px-4 py-3 text-white outline-none placeholder:text-qn-muted-2 focus:border-qn-accent/50 focus:ring-2 focus:ring-qn-accent/30"
            placeholder="Share your setup, delivery, or real-world use experience."
          />
        </label>

        <button
          type="submit"
          disabled={!canReview || loading}
          className="qn-btn-primary px-6 disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Submit review"}
        </button>
      </form>

      {message ? (
        <p className="mt-4 rounded-xl border border-white/[0.08] bg-qn-card-2 px-4 py-3 text-sm text-qn-muted">
          {message}
        </p>
      ) : null}
    </div>
  );
}
