export function parseRewardAmount(input: string): number | null {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;
  const n = Number(digits);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function isValidRewardNote(input: string): boolean {
  const t = input.trim();
  if (!t) return true;
  const amount = parseRewardAmount(t);
  if (amount === null) return false;
  return amount <= 100_000;
}

export const REWARD_ERROR = "Reward amount must be numeric and at most ₹1,00,000.";
