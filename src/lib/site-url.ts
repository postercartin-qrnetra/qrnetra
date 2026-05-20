const LOCAL_SITE_URL = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/$/, "");
}

function isLocalSiteUrl(url: string): boolean {
  return LOCAL_SITE_URL.test(normalizeBaseUrl(url));
}

/**
 * Resolve the absolute base URL used to render QR images, OAuth callbacks and
 * any other place we need a "public" link.
 *
 * Priority:
 *  1. NEXT_PUBLIC_SITE_URL — explicit production override (ignored on Vercel
 *     when it still points at localhost).
 *  2. NEXT_PUBLIC_VERCEL_URL — auto-set on every Vercel deployment.
 *  3. http://localhost:3000 — local dev default.
 */
export function getPublicSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;

  if (vercel && vercel.trim()) {
    const trimmed = normalizeBaseUrl(vercel);
    const vercelUrl = trimmed.startsWith("http")
      ? trimmed
      : `https://${trimmed}`;

    if (!explicit?.trim() || isLocalSiteUrl(explicit)) {
      return vercelUrl;
    }
  }

  if (explicit && explicit.trim()) {
    return normalizeBaseUrl(explicit);
  }

  if (vercel && vercel.trim()) {
    const trimmed = normalizeBaseUrl(vercel);
    return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  }

  return "http://localhost:3000";
}
