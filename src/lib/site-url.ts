const LOCAL_SITE_URL = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/$/, "");
}

function isLocalSiteUrl(url: string): boolean {
  return LOCAL_SITE_URL.test(normalizeBaseUrl(url));
}

/**
 * Public base URL for QR codes, OAuth redirects, and absolute links.
 *
 * Always prefers `NEXT_PUBLIC_SITE_URL` (e.g. https://qrnetra.com) so printed
 * QRs never encode preview or deployment hostnames.
 *
 * Falls back to http://localhost:3000 in local dev when unset.
 */
export function getPublicSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;

  if (explicit?.trim()) {
    return normalizeBaseUrl(explicit);
  }

  return "http://localhost:3000";
}

/** True when running locally without a production site URL configured. */
export function isLocalDevSite(): boolean {
  const url = getPublicSiteUrl();
  return isLocalSiteUrl(url);
}
