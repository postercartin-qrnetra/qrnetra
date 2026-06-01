import "server-only";

export type GeoResult = {
  country: string | null;
  city: string | null;
};

function countryFromHeaders(headers: Headers): string | null {
  const candidates = [
    headers.get("x-vercel-ip-country"),
    headers.get("cf-ipcountry"),
    headers.get("x-country-code"),
  ];
  for (const c of candidates) {
    const trimmed = c?.trim();
    if (trimmed && trimmed !== "XX" && trimmed.length <= 64) {
      return trimmed;
    }
  }
  return null;
}

function isPrivateIp(ip: string): boolean {
  if (ip === "unknown" || ip === "127.0.0.1" || ip === "::1") return true;
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  return false;
}

async function lookupCityFromIp(ip: string): Promise<GeoResult> {
  if (isPrivateIp(ip)) {
    return { country: null, city: null };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode,city`,
      { signal: controller.signal, cache: "no-store" },
    );
    if (!res.ok) return { country: null, city: null };
    const data = (await res.json()) as {
      status?: string;
      country?: string;
      countryCode?: string;
      city?: string;
    };
    if (data.status !== "success") return { country: null, city: null };
    return {
      country: data.countryCode?.trim() || data.country?.trim() || null,
      city: data.city?.trim() || null,
    };
  } catch {
    return { country: null, city: null };
  } finally {
    clearTimeout(timeout);
  }
}

export async function resolveGeoFromRequest(
  headers: Headers,
  rawIp: string,
): Promise<GeoResult> {
  const headerCountry = countryFromHeaders(headers);
  const lookup = await lookupCityFromIp(rawIp);

  return {
    country: headerCountry ?? lookup.country,
    city: lookup.city,
  };
}
