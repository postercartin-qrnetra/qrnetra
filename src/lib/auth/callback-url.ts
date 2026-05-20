import { getPublicSiteUrl } from "@/lib/site-url";

const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

function isLocalOrigin(origin: string): boolean {
  return LOCAL_ORIGIN.test(origin.replace(/\/$/, ""));
}

/**
 * Origin used in OAuth / magic-link redirectTo URLs.
 * In the browser, prefer the live page origin so preview deploys work.
 * Fall back to getPublicSiteUrl() for SSR or non-browser contexts.
 */
export function getAuthRedirectOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    const live = window.location.origin.replace(/\/$/, "");
    if (!isLocalOrigin(live)) {
      return live;
    }
    const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(
      /\/$/,
      "",
    );
    if (configured && !isLocalOrigin(configured)) {
      return configured;
    }
    return live;
  }
  return getPublicSiteUrl();
}

/** Absolute URL for the Supabase OAuth / email callback route. */
export function buildAuthCallbackUrl(nextPath: string): string {
  const origin = getAuthRedirectOrigin();
  return `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}

/**
 * Resolve the public origin for redirects in route handlers (behind Vercel, etc.).
 */
export function getRequestOrigin(request: Request): string {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "https";

  if (forwardedHost) {
    const host = forwardedHost.split(",")[0]?.trim();
    if (host) {
      return `${forwardedProto}://${host}`;
    }
  }

  return url.origin;
}
