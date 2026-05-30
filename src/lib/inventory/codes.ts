const ACTIVATION_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** Excludes ambiguous characters (0/O, 1/I/L). */
export function generateActivationCode(length = 6): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ACTIVATION_ALPHABET[bytes[i]! % ACTIVATION_ALPHABET.length];
  }
  return code;
}

export function generatePresetSlug(): string {
  const part = () =>
    Math.random().toString(36).slice(2, 8).replace(/[^a-z0-9]/g, "a");
  return `qn-${part()}${part()}`;
}
