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
    "/dashboard",
    "/create/type",
    "/login",
    "/auth/update-password",
  ]);

  if (allowedExact.has(pathname)) {
    return path;
  }

  const allowedPrefixes = [
    "/create/profile",
    "/dashboard/",
    "/create/type/",
  ];

  if (allowedPrefixes.some((p) => pathname.startsWith(p))) {
    return path;
  }

  return "/dashboard";
}
