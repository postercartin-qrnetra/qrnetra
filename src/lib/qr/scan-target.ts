export type ParsedScanTarget =
  | { kind: "public"; slug: string }
  | { kind: "activation"; code: string }
  | { kind: "unsupported" };

function parseRelativePath(value: string): URL | null {
  if (!value.startsWith("/")) return null;

  try {
    return new URL(value, "https://qrnetra.local");
  } catch {
    return null;
  }
}

export function parseQrnetraScanTarget(value: string): ParsedScanTarget {
  const trimmed = value.trim();
  if (!trimmed) return { kind: "unsupported" };

  let parsed: URL | null = null;

  try {
    parsed = new URL(trimmed);
  } catch {
    parsed = parseRelativePath(trimmed);
  }

  if (!parsed) {
    return { kind: "unsupported" };
  }

  if (parsed.pathname.startsWith("/activate")) {
    const code = parsed.searchParams.get("code")?.trim();
    if (code) {
      return { kind: "activation", code };
    }
  }

  const publicMatch = parsed.pathname.match(/^\/s\/([^/?#]+)/);
  if (publicMatch?.[1]) {
    return { kind: "public", slug: decodeURIComponent(publicMatch[1]) };
  }

  return { kind: "unsupported" };
}
