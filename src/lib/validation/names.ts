const NAME_RE = /^[\p{L}\s'-]+$/u;
const HTML_RE = /<[^>]+>/;
const URL_RE = /https?:\/\/|www\./i;

export function normalizeName(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

export function normalizeUpperName(input: string): string {
  return normalizeName(input).toUpperCase();
}

export function isValidPersonName(input: string): boolean {
  const t = normalizeName(input);
  if (!t || t.length < 2 || t.length > 80) return false;
  if (HTML_RE.test(t) || URL_RE.test(t)) return false;
  if (/^\d+$/.test(t.replace(/\s/g, ""))) return false;
  return NAME_RE.test(t);
}

export const NAME_ERROR =
  "Enter a valid name (letters, spaces, hyphens only; at least 2 characters).";
