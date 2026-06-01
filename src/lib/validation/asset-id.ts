const ASSET_ID_RE = /^[A-Za-z0-9/-]+$/;
const MAX_LEN = 64;

export function normalizeAssetId(input: string): string {
  return input.trim().toUpperCase();
}

export function isValidAssetId(input: string): boolean {
  const t = input.trim();
  if (!t || t.length > MAX_LEN) return false;
  if (/<|>|script/i.test(t)) return false;
  return ASSET_ID_RE.test(t);
}

export const ASSET_ID_ERROR =
  "Asset ID may only contain letters, numbers, hyphens, and slashes.";
