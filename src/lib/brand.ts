import type { QrKind } from "@/lib/qr/types";

/** URL-safe paths (copies of files in public/logos/) */
export const LOGO_STATIC_SRC = "/logos/qrnetra-logo.jpeg";
export const LOGO_ANIMATED_SRC = "/logos/qrnetra-logo-animated.mp4";

/** Intrinsic asset dimensions (square master) */
export const LOGO_INTRINSIC_WIDTH = 500;
export const LOGO_INTRINSIC_HEIGHT = 500;

/** Navbar logo heights — no CSS transform scaling */
export const LOGO_HEIGHT_MOBILE = 40;
export const LOGO_HEIGHT_TABLET = 48;
export const LOGO_HEIGHT_DESKTOP = 52;

/** Reserved logo column on desktop nav (whitespace + mark) */
export const LOGO_NAV_AREA_MIN_WIDTH = 220;

export const PRODUCT_NAV_ITEMS: {
  label: string;
  href: string;
  description?: string;
  kind?: QrKind;
}[] = [
  {
    label: "Vehicles",
    href: "/products/vehicles",
    description: "Cars, bikes, helmets, and parking stickers",
  },
  {
    label: "Pets",
    href: "/products/pets",
    description: "Dog, cat, and general pet recovery tags",
  },
  {
    label: "Kids",
    href: "/products/kids",
    description: "School bag tags, emergency tags, and wristbands",
  },
  {
    label: "Assets",
    href: "/products/assets",
    description: "Keys, wallets, luggage, laptops, and essentials",
  },
  {
    label: "Digital QR Profile",
    href: "/create",
    description: "Free — no sticker required",
  },
  {
    label: "Business & Fleet Solutions",
    href: "/business-fleet",
    description: "Volume pricing & admin tools",
  },
];

export const BUSINESS_FLEET_USE_CASES = [
  "Vehicle fleets",
  "Schools",
  "Housing societies",
  "Delivery companies",
  "Corporate assets",
  "Pet shelters",
  "Event organizers",
];
