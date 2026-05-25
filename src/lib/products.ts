import type { QrKind } from "@/lib/qr/types";

export type ProductSlug =
  | "vehicle"
  | "pet"
  | "child"
  | "keychain"
  | "business";

export type Product = {
  slug: ProductSlug;
  name: string;
  tagline: string;
  description: string;
  price: number;
  priceLabel: string;
  category: string;
  badge?: string;
  /** Maps to QrKind for profile-creation flow. null = link to /business-fleet */
  qrKind: QrKind | null;
  features: string[];
  specs: string[];
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "vehicle",
    name: "Vehicle QR Sticker",
    tagline: "Wrong parking solved in seconds",
    description:
      "Weatherproof vinyl sticker for any vehicle. Finders scan and reach you via masked relay — no number exposed.",
    price: 299,
    priceLabel: "From ₹299",
    category: "Vehicle QR Stickers",
    badge: "Bestseller",
    qrKind: "vehicle",
    features: [
      "Masked phone contact",
      "WhatsApp alert",
      "Wrong-parking message",
      "Weatherproof vinyl",
      "Dynamic profile editing",
      "Scan analytics",
    ],
    specs: [
      "Material: Waterproof vinyl",
      "Size: 5 × 5 cm",
      "Durability: 3+ years outdoor",
      "Delivery: 3–5 business days",
    ],
    emoji: "🚗",
    gradientFrom: "from-slate-800",
    gradientTo: "to-qn-bg-deep",
  },
  {
    slug: "pet",
    name: "Pet QR Tag",
    tagline: "Lost pet recovery, simplified",
    description:
      "Durable collar-mount tag with your pet's profile and vet info. Finder scans and reaches you instantly.",
    price: 249,
    priceLabel: "From ₹249",
    category: "Pet QR Tags",
    badge: "Popular",
    qrKind: "pet",
    features: [
      "Instant owner contact",
      "Vaccination & vet fields",
      "Lost mode with alert",
      "Privacy toggles",
      "Durable collar mount",
      "WhatsApp notification",
    ],
    specs: [
      "Material: Stainless steel or hard plastic",
      "Size: 3 × 3 cm",
      "Durability: 2+ years",
      "Delivery: 3–5 business days",
    ],
    emoji: "🐾",
    gradientFrom: "from-amber-900",
    gradientTo: "to-qn-bg-deep",
  },
  {
    slug: "child",
    name: "Child Safety Wristband",
    tagline: "Peace of mind at every event",
    description:
      "Soft silicone wristband with your child's profile, medical notes, and emergency contacts. School-safe design.",
    price: 399,
    priceLabel: "From ₹399",
    category: "Child Safety Wristbands",
    badge: "Parent pick",
    qrKind: "child",
    features: [
      "Soft silicone band",
      "Medical & allergy notes",
      "Emergency contact relay",
      "School-safe no-alarm design",
      "Parent dashboard",
      "Controlled medical visibility",
    ],
    specs: [
      "Material: Soft silicone",
      "Adjustable: 15–22 cm wrist",
      "Water-resistant: Yes",
      "Delivery: 3–5 business days",
    ],
    emoji: "🧒",
    gradientFrom: "from-sky-900",
    gradientTo: "to-qn-bg-deep",
  },
  {
    slug: "keychain",
    name: "QR Keychain",
    tagline: "Never lose your keys again",
    description:
      "Compact keychain QR for bags, keys, and everyday carry. Finder scans and you get notified immediately.",
    price: 199,
    priceLabel: "From ₹199",
    category: "QR Keychains",
    badge: "Compact",
    qrKind: "vehicle",
    features: [
      "Compact keychain form",
      "Instant finder alert",
      "Masked owner contact",
      "Works for bags & luggage",
      "Dynamic profile editing",
      "Durable finish",
    ],
    specs: [
      "Material: Metal / hard plastic",
      "Size: 3 × 5 cm",
      "Includes: Split ring",
      "Delivery: 3–5 business days",
    ],
    emoji: "🔑",
    gradientFrom: "from-zinc-800",
    gradientTo: "to-qn-bg-deep",
  },
  {
    slug: "business",
    name: "Business & Fleet Solutions",
    tagline: "QR safety at scale for organizations",
    description:
      "Bulk QR tags for fleets, schools, housing societies, and enterprises. Admin dashboard, branded tags, and volume pricing.",
    price: 0,
    priceLabel: "Custom pricing",
    category: "Business & Fleet Solutions",
    badge: "B2B",
    qrKind: null,
    features: [
      "Mixed product catalog",
      "Volume discounts",
      "GST invoicing",
      "Admin controls",
      "Branded tags available",
      "Dedicated onboarding",
    ],
    specs: [
      "Minimum order: 50 tags",
      "Custom branding: Available",
      "Billing: PO & invoice",
      "Support: Dedicated manager",
    ],
    emoji: "🏢",
    gradientFrom: "from-emerald-900",
    gradientTo: "to-qn-bg-deep",
  },
];

export const PRODUCT_CATEGORIES = [
  {
    title: "Vehicle QR Stickers",
    slug: "vehicle",
    products: PRODUCTS.filter((p) => p.slug === "vehicle"),
  },
  {
    title: "Pet QR Tags",
    slug: "pet",
    products: PRODUCTS.filter((p) => p.slug === "pet"),
  },
  {
    title: "Child Safety Wristbands",
    slug: "child",
    products: PRODUCTS.filter((p) => p.slug === "child"),
  },
  {
    title: "QR Keychains",
    slug: "keychain",
    products: PRODUCTS.filter((p) => p.slug === "keychain"),
  },
  {
    title: "Business & Fleet Solutions",
    slug: "business",
    products: PRODUCTS.filter((p) => p.slug === "business"),
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
