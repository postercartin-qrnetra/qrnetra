"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  persistOnboardingPath,
  persistSelectedProfileType,
} from "@/lib/onboarding/client-storage";
import type { QrKind } from "@/lib/qr/types";

type Props = {
  type: QrKind;
  className?: string;
  children: React.ReactNode;
};

/**
 * Stores profile type, then routes to profile creation if signed in,
 * otherwise to login with a safe `next` back to /create/profile?type=….
 */
export function ProfileTypeContinueButton({
  type,
  className,
  children,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);
    persistSelectedProfileType(type);
    const profilePath = `/create/profile?type=${type}`;
    persistOnboardingPath(profilePath);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push(profilePath);
        router.refresh();
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
      onClick={() => void handleContinue()}
      className={className}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
