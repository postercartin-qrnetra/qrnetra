"use client";

import { ONBOARDING_NEXT_KEY } from "@/lib/onboarding/constants";
import { safeNextPath } from "@/lib/onboarding/safe-next";

export function persistOnboardingPath(profilePath: string) {
  try {
    const safe = safeNextPath(profilePath);
    if (safe.startsWith("/create/profile")) {
      localStorage.setItem(ONBOARDING_NEXT_KEY, safe);
    }
  } catch {
    /* ignore */
  }
}

export function consumeStoredOnboardingPath(): string | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_NEXT_KEY);
    if (!raw) return null;
    localStorage.removeItem(ONBOARDING_NEXT_KEY);
    const safe = safeNextPath(raw);
    return safe.startsWith("/create/profile") ? safe : null;
  } catch {
    return null;
  }
}

/** After email/password sign-in: prefer `next` query, else stored onboarding path. */
export function resolvePostLoginRedirect(nextParam: string | null): string {
  if (nextParam) {
    return safeNextPath(nextParam);
  }
  return consumeStoredOnboardingPath() ?? "/dashboard";
}

/** For OAuth redirect: same as post-login but do not consume localStorage (callback is server-side). */
export function getOAuthReturnPath(searchNext: string | null): string {
  if (searchNext) {
    return safeNextPath(searchNext);
  }
  try {
    const raw = localStorage.getItem(ONBOARDING_NEXT_KEY);
    if (raw) {
      const safe = safeNextPath(raw);
      if (safe.startsWith("/create/profile")) return safe;
    }
  } catch {
    /* ignore */
  }
  return "/dashboard";
}

export function clearOnboardingDraftMarker() {
  try {
    localStorage.removeItem(ONBOARDING_NEXT_KEY);
  } catch {
    /* ignore */
  }
}
