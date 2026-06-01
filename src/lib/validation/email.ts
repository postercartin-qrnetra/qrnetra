const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(input: string): boolean {
  const t = input.trim();
  if (!t || t.length > 254) return false;
  return EMAIL_RE.test(t);
}

export const EMAIL_ERROR = "Enter a valid email address.";
