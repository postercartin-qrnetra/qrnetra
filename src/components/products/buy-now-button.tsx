"use client";

import {
  persistOnboardingPath,
  persistSelectedProfileType,
} from "@/lib/onboarding/client-storage";
import type { ProductSlug } from "@/lib/products";
import type { QrKind } from "@/lib/qr/types";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  qrKind: QrKind;
  productSlug: ProductSlug;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Persists selected product + profile type, then routes to profile creation.
 * After profile creation the user continues to checkout.
 */
export function BuyNowButton({ qrKind, productSlug, className, children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    persistSelectedProfileType(qrKind);
    const profilePath = `/create/profile?type=${qrKind}&product=${productSlug}`;
    persistOnboardingPath(profilePath);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push(profilePath);
      } else {
        router.push(`/login?next=${encodeURIComponent(profilePath)}`);
      }
    } catch {
      router.push(`/login?next=${encodeURIComponent(profilePath)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => void handleClick()}
      className={className}
    >
      {loading ? "Please wait…" : (children ?? "Buy Now")}
    </button>
  );
}
