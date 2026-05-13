/**
 * Resolve the absolute base URL used to render QR images, OAuth callbacks and
 * any other place we need a "public" link.
 *
 * Priority:
 *  1. NEXT_PUBLIC_SITE_URL — explicit override, use this for production.
 *  2. NEXT_PUBLIC_VERCEL_URL — populated by Vercel on every deployment. Falls
 *     back to https:// so previews work out of the box.
 *  3. http://localhost:3000 — dev default.
 */
export function getPublicSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit && explicit.trim()) {
    return explicit.replace(/\/$/, "");
  }

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel && vercel.trim()) {
    const trimmed = vercel.replace(/\/$/, "");
    return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  }

  return "http://localhost:3000";
}
