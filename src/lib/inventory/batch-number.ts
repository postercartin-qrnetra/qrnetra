/** Batch label e.g. 2026-001 */
export function suggestNextBatchNumber(existing: string[]): string {
  const year = new Date().getFullYear();
  const prefix = `${year}-`;
  const sameYear = existing
    .filter((b) => b.startsWith(prefix))
    .map((b) => parseInt(b.slice(prefix.length), 10))
    .filter((n) => !Number.isNaN(n));
  const next = sameYear.length > 0 ? Math.max(...sameYear) + 1 : 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}
