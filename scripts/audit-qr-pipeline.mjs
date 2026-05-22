/**
 * Offline audit: validation mapping, slug format, QR encode URL, insert shape.
 * Run: node scripts/audit-qr-pipeline.mjs
 */
import QRCode from "qrcode";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const QNR_PREFIX = "QNR-";

function generateQnrSlug() {
  let s = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 6; i++) {
    s += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `${QNR_PREFIX}${s}`;
}

function buildPublicScanUrl(siteOrigin, slug) {
  const base = siteOrigin.replace(/\/$/, "");
  return `${base}/s/${slug}`;
}

const kinds = ["vehicle", "child", "pet", "business"];
const samples = {
  vehicle: {
    type: "vehicle",
    full_name: "Test Owner",
    phone: "9876543210",
    vehicle_number: "MH12AB1234",
  },
  child: {
    type: "child",
    child_name: "Test Child",
    parent_contact: "9876543210",
    blood_group: "O+",
  },
  pet: { type: "pet", pet_name: "Bruno", owner_contact: "9876543210" },
  business: {
    type: "business",
    company_name: "Acme Fleet",
    admin_contact: "9876543210",
  },
};

console.log("=== Slug generation ===");
const slug = generateQnrSlug();
console.log("Generated slug:", slug);
console.log("Format valid:", /^QNR-[A-Z0-9]{6}$/.test(slug));

const site = "https://qrnetra.vercel.app";
const scanUrl = buildPublicScanUrl(site, slug);
console.log("\n=== QR encode URL (must be scan path only) ===");
console.log(scanUrl);
console.log("Matches expected host/path:", scanUrl === `${site}/s/${slug}`);

const [png, svg] = await Promise.all([
  QRCode.toDataURL(scanUrl, { width: 256 }),
  QRCode.toString(scanUrl, { type: "svg" }),
]);
console.log("\n=== QR image generation ===");
console.log("PNG data URL prefix:", png.slice(0, 30));
console.log("SVG starts with:", svg.trim().slice(0, 40));
console.log("qrcode package: OK");

console.log("\n=== Per-kind data_json keys (would be stored) ===");
for (const kind of kinds) {
  const raw = samples[kind];
  const dataJson = Object.fromEntries(
    Object.entries(raw).filter(([k, v]) => k !== "type" && String(v).trim()),
  );
  console.log(kind, "->", JSON.stringify(dataJson));
}

console.log("\n=== Schema note ===");
console.log(
  "Code inserts qr_profiles + qr_codes (not a single `profiles` row for emergency data).",
);
console.log(
  "public.profiles is auth mirror (id, display_name, phone) only.",
);
