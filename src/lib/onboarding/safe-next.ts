/**
 * Prevent open redirects: only allow same-origin relative paths we expect.
 */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") {
    return "/dashboard";
  }

  const decoded = (() => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();

  const path = decoded.trim();
  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard";
  }

  const [pathname] = path.split("?");
  const allowedExact = new Set([
    "/",
    "/activate",
    "/order",
    "/scan",
    "/dashboard",
    "/create",
    "/login",
    "/auth/update-password",
  ]);

  if (allowedExact.has(pathname)) {
    return path;
  }

  const allowedPrefixes = [
    "/activate/",
    "/create/",
    "/dashboard/",
    "/order/",
  ];

  if (allowedPrefixes.some((p) => pathname.startsWith(p))) {
    return path;
  }

  return "/dashboard";
}
