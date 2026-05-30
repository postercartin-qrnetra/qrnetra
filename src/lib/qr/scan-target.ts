export type ParsedScanTarget =
  | { kind: "public"; slug: string }
  | { kind: "activation"; code: string }
  | { kind: "activation_tag"; tagId: string }
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
    const tagMatch = parsed.pathname.match(/^\/activate\/([^/?#]+)/);
    if (tagMatch?.[1]) {
      const tagId = decodeURIComponent(tagMatch[1]).trim();
      if (/^[VPBC]-QRN-\d{6}$/i.test(tagId)) {
        return { kind: "activation_tag", tagId: tagId.toUpperCase() };
      }
    }
    const code = parsed.searchParams.get("code")?.trim();
    if (code) {
      return { kind: "activation", code };
    }
    const tag = parsed.searchParams.get("tag")?.trim();
    if (tag && /^[VPBC]-QRN-\d{6}$/i.test(tag)) {
      return { kind: "activation_tag", tagId: tag.toUpperCase() };
    }
  }

  const publicMatch = parsed.pathname.match(/^\/s\/([^/?#]+)/);
  if (publicMatch?.[1]) {
    return { kind: "public", slug: decodeURIComponent(publicMatch[1]) };
  }

  return { kind: "unsupported" };
}
