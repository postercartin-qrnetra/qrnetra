"use client";

import {
  ONBOARDING_NEXT_KEY,
  SELECTED_PROFILE_TYPE_KEY,
} from "@/lib/onboarding/constants";
import { isQrKind, type QrKind } from "@/lib/qr/types";
import { safeNextPath } from "@/lib/onboarding/safe-next";

export function persistSelectedProfileType(type: QrKind) {
  try {
    localStorage.setItem(SELECTED_PROFILE_TYPE_KEY, type);
  } catch {
    /* ignore */
  }
}

export function readSelectedProfileType(): QrKind | null {
  try {
    const raw = localStorage.getItem(SELECTED_PROFILE_TYPE_KEY);
    if (raw && isQrKind(raw)) return raw;
  } catch {
    /* ignore */
  }
  return null;
}

export function clearSelectedProfileType() {
  try {
    localStorage.removeItem(SELECTED_PROFILE_TYPE_KEY);
  } catch {
    /* ignore */
  }
}

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

/** Sync `selectedProfileType` from a `/create/profile?type=…` path. */
export function persistProfileTypeFromPath(path: string) {
  try {
    const q = path.includes("?") ? path.split("?")[1] : "";
    const type = new URLSearchParams(q).get("type");
    if (type && isQrKind(type)) {
      persistSelectedProfileType(type);
    }
  } catch {
    /* ignore */
  }
}

/** After email/password sign-in: prefer `next` query, else stored onboarding path. */
export function resolvePostLoginRedirect(nextParam: string | null): string {
  if (nextParam) {
    const safe = safeNextPath(nextParam);
    persistProfileTypeFromPath(safe);
    return safe;
  }
  const stored = consumeStoredOnboardingPath();
  if (stored) {
    persistProfileTypeFromPath(stored);
    return stored;
  }
  return "/dashboard";
}

/** For OAuth redirect: same as post-login but do not consume localStorage (callback is server-side). */
export function getOAuthReturnPath(searchNext: string | null): string {
  if (searchNext) {
    const safe = safeNextPath(searchNext);
    persistProfileTypeFromPath(safe);
    return safe;
  }
  try {
    const raw = localStorage.getItem(ONBOARDING_NEXT_KEY);
    if (raw) {
      const safe = safeNextPath(raw);
      if (safe.startsWith("/create/profile")) {
        persistProfileTypeFromPath(safe);
        return safe;
      }
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
