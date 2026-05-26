import type { QrKind } from "@/lib/qr/types";

export type ProductPrimaryCategory = "vehicles" | "pets" | "kids" | "assets";
export type ProductSlug = string;
export type ProductProfileVariant =
  | "vehicle"
  | "pet"
  | "child_wristband"
  | "child_school_bag";

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductFaq = {
  question: string;
  answer: string;
};

export type ProductReview = {
  rating: number;
  title: string;
  text: string;
  reviewerName: string;
  location: string;
  createdAt: string;
};

export type ProductSpecification = {
  label: string;
  value: string;
};

export type Product = {
  title: string;
  slug: ProductSlug;
  legacySlugs?: ProductSlug[];
  skuCode: string;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  imageDirectory: string;
  price: number;
  salePrice: number | null;
  category: ProductPrimaryCategory;
  tags: string[];
  stock: number;
  shippingWeight: number;
  faq: ProductFaq[];
  activeStatus: boolean;
  profileKind: Extract<QrKind, "vehicle" | "pet" | "child" | "asset">;
  profileVariant: ProductProfileVariant;
  features: string[];
  benefits: string[];
  specifications: ProductSpecification[];
  deliveryInfo: string[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
};

export type ProductCategoryMeta = {
  key: ProductPrimaryCategory;
  title: string;
  shortTitle: string;
  href: string;
  description: string;
  benefits: string[];
  faq: ProductFaq[];
  seoTitle: string;
  seoDescription: string;
  featuredSlugs: string[];
};

const PRODUCT_CATEGORY_META: Record<ProductPrimaryCategory, ProductCategoryMeta> = {
  vehicles: {
    key: "vehicles",
    title: "Vehicle Safety Products",
    shortTitle: "Vehicles",
    href: "/products/vehicles",
    description:
      "Scan-ready parking and emergency stickers that permanently connect your vehicle to an editable QRNetra profile.",
    benefits: [
      "Permanent dynamic QR linked to your dashboard",
      "Wrong parking and emergency contact support",
      "Weather-resistant print finish for Indian roads",
    ],
    faq: [
      {
        question: "Does the QR stay the same if I edit my details later?",
        answer:
          "Yes. The printed QR remains permanent while you can update vehicle profile information from your dashboard anytime.",
      },
      {
        question: "What happens after I place the order?",
        answer:
          "Your QR profile is created instantly, payment confirms the order, and QRNetra prints the same linked QR on your physical sticker.",
      },
    ],
    seoTitle: "Vehicle QR Sticker for Parking and Emergency Contact",
    seoDescription:
      "Buy QRNetra's Vehicle QR Sticker with a permanent dashboard-linked QR for parking issues and emergency contact.",
    featuredSlugs: ["vehicle-qr-sticker"],
  },
  pets: {
    key: "pets",
    title: "Pet Recovery Products",
    shortTitle: "Pets",
    href: "/products/pets",
    description:
      "Collar-ready tags that help finders reach a pet owner quickly through a dashboard-linked QR profile.",
    benefits: [
      "Pet and owner details update without replacing the tag",
      "Built for collars, walks, parks, and daily wear",
      "Supports vet notes and safe-return messaging",
    ],
    faq: [
      {
        question: "Can I update the pet profile after delivery?",
        answer:
          "Yes. The tag keeps the same QR while you can update owner, vet, breed, or reward details from your dashboard anytime.",
      },
      {
        question: "Is this tag lightweight enough for everyday use?",
        answer:
          "Yes. The Pet Collar QR Tag is designed for daily collar use while still keeping the QR visible for finders.",
      },
    ],
    seoTitle: "Pet Collar QR Tag for Dogs and Cats",
    seoDescription:
      "Order QRNetra's Pet Collar QR Tag to link your pet's collar to a permanent editable recovery profile.",
    featuredSlugs: ["pet-collar-qr-tag"],
  },
  kids: {
    key: "kids",
    title: "Child Safety Products",
    shortTitle: "Kids",
    href: "/products/kids",
    description:
      "Wristbands and school bag tags that keep guardian contact and child safety information one scan away.",
    benefits: [
      "Permanent QR linked to a child safety profile",
      "Built for daily school use and family outings",
      "Emergency contact details remain editable forever",
    ],
    faq: [
      {
        question: "What is the difference between the wristband and bag tag?",
        answer:
          "The wristband is best for travel, events, and younger children, while the school bag tag is built for daily school carry and class-level details.",
      },
      {
        question: "Can both parents update the information later?",
        answer:
          "The dashboard owner can update the linked QR profile at any time, so emergency contacts and school details can stay current.",
      },
    ],
    seoTitle: "Child Safety Wristband and School Bag QR Tag",
    seoDescription:
      "Buy QRNetra child safety products that connect a permanent QR to parent and emergency contact information.",
    featuredSlugs: ["child-safety-wristband", "child-school-bag-tag"],
  },
  assets: {
    key: "assets",
    title: "Asset Recovery Products",
    shortTitle: "Assets",
    href: "/products/assets",
    description:
      "Personal belonging recovery tags will return in a future catalog refresh. Today's physical store focuses on vehicles, pets, and child safety.",
    benefits: [
      "Dashboard-linked QR architecture already supports asset recovery",
      "Printable QR assets and profile editing primitives are in place",
      "Future SKU expansion can reuse the same fulfillment flow",
    ],
    faq: [
      {
        question: "Are asset products available right now?",
        answer:
          "Not in the current physical storefront. QRNetra's active physical products are vehicle, pet, and child safety items.",
      },
    ],
    seoTitle: "QRNetra Asset Recovery Products",
    seoDescription:
      "QRNetra asset recovery products are not currently active in the storefront.",
    featuredSlugs: [],
  },
};

const PHYSICAL_PRODUCTS: Product[] = [
  {
    title: "Vehicle QR Sticker",
    slug: "vehicle-qr-sticker",
    legacySlugs: [
      "car-qr-sticker",
      "bike-qr-sticker",
      "helmet-qr-sticker",
      "parking-contact-sticker",
    ],
    skuCode: "QRN-VEH-STICKER-001",
    description:
      "A premium weather-ready sticker for cars, bikes, and everyday vehicle parking that permanently links to your QRNetra dashboard profile. If someone scans it for wrong parking or an urgent issue, they reach the latest version of your contact profile without you reprinting the QR.",
    shortDescription:
      "Parking and emergency contact sticker linked permanently to your QRNetra dashboard.",
    imageDirectory: "vehicle-qr-sticker",
    images: [
      {
        src: "/products/vehicle-qr-sticker/main.svg",
        alt: "Vehicle QR Sticker hero product image",
      },
      {
        src: "/products/vehicle-qr-sticker/detail-1.svg",
        alt: "Vehicle QR Sticker close-up detail",
      },
      {
        src: "/products/vehicle-qr-sticker/detail-2.svg",
        alt: "Vehicle QR Sticker on a parked car windshield",
      },
    ],
    price: 299,
    salePrice: null,
    category: "vehicles",
    tags: ["vehicle", "parking", "wrong parking", "dashboard-linked"],
    stock: 250,
    shippingWeight: 0.05,
    faq: [
      {
        question: "Where should I place the sticker?",
        answer:
          "For best scanability, place it on the inside lower corner of the windshield or another clean visible surface on the vehicle.",
      },
      {
        question: "Will I need to buy another sticker if I change my phone number?",
        answer:
          "No. The physical sticker keeps the same QR permanently while your dashboard lets you update contact and emergency details later.",
      },
    ],
    activeStatus: true,
    profileKind: "vehicle",
    profileVariant: "vehicle",
    features: [
      "Permanent dynamic QR linked to your dashboard",
      "Wrong parking and emergency contact ready",
      "Weather-resistant print finish",
      "Editable owner details with no reprint required",
    ],
    benefits: [
      "Get contacted quickly without printing your mobile number openly",
      "Use the same QR forever even if profile details change",
      "Works for daily parking, offices, apartments, and public spaces",
    ],
    specifications: [
      { label: "Format", value: "Vehicle adhesive sticker" },
      { label: "Use case", value: "Wrong parking and emergency contact" },
      { label: "QR destination", value: "Permanent QRNetra public profile" },
      { label: "Linked profile", value: "Vehicle owner dashboard profile" },
    ],
    deliveryInfo: [
      "Ships within 1 business day after successful payment",
      "Estimated delivery in 3-5 business days across India",
      "Tracking updates appear in your QRNetra dashboard order page",
    ],
    rating: 4.8,
    reviewCount: 18,
    reviews: [
      {
        rating: 5,
        title: "Perfect for daily parking",
        text: "Received my vehicle sticker in 4 days. QR works perfectly and someone contacted me when my car lights were left on.",
        reviewerName: "Rahul S.",
        location: "Mumbai",
        createdAt: "2026-05-01",
      },
      {
        rating: 5,
        title: "Exactly what I wanted",
        text: "Much better than leaving my phone number on the dashboard. The linked QR profile looks premium and easy to update.",
        reviewerName: "Priya M.",
        location: "Delhi",
        createdAt: "2026-04-22",
      },
    ],
  },
  {
    title: "Pet Collar QR Tag",
    slug: "pet-collar-qr-tag",
    legacySlugs: ["dog-collar-tag", "cat-collar-tag", "pet-id-tag"],
    skuCode: "QRN-PET-TAG-001",
    description:
      "A collar-ready recovery tag that permanently connects your pet's physical tag to a QRNetra dashboard profile. Finders can scan it to reach the latest owner details, pet information, and vet context without the tag ever needing to change.",
    shortDescription:
      "Collar-ready QR tag for pet recovery, owner contact, and vet-aware details.",
    imageDirectory: "pet-collar-qr-tag",
    images: [
      {
        src: "/products/pet-collar-qr-tag/main.svg",
        alt: "Pet Collar QR Tag hero product image",
      },
      {
        src: "/products/pet-collar-qr-tag/detail-1.svg",
        alt: "Pet Collar QR Tag attached to a pet collar",
      },
      {
        src: "/products/pet-collar-qr-tag/detail-2.svg",
        alt: "Pet Collar QR Tag finder scan illustration",
      },
    ],
    price: 499,
    salePrice: null,
    category: "pets",
    tags: ["pet", "collar", "recovery", "vet details"],
    stock: 180,
    shippingWeight: 0.03,
    faq: [
      {
        question: "Can I update the pet information later?",
        answer:
          "Yes. The tag keeps the same QR while you can update owner, vet, breed, or reward details from your dashboard anytime.",
      },
      {
        question: "Does this work only for dogs?",
        answer:
          "No. The tag works for dogs, cats, and other pets that use a collar or harness-compatible attachment.",
      },
    ],
    activeStatus: true,
    profileKind: "pet",
    profileVariant: "pet",
    features: [
      "Permanent dashboard-linked collar tag",
      "Supports pet, owner, and vet information",
      "Finder-friendly lost-pet scan flow",
      "Reusable profile even if details change later",
    ],
    benefits: [
      "Gives finders a simple way to contact you fast",
      "Lets you update recovery instructions without replacing the tag",
      "Keeps pet identity details ready for emergencies and safe return",
    ],
    specifications: [
      { label: "Format", value: "Collar QR tag" },
      { label: "Use case", value: "Pet recovery and owner contact" },
      { label: "QR destination", value: "Permanent QRNetra pet profile" },
      { label: "Linked profile", value: "Pet dashboard profile" },
    ],
    deliveryInfo: [
      "Ships within 1 business day after payment confirmation",
      "Estimated delivery in 3-5 business days across India",
      "Order tracking becomes visible in your dashboard after dispatch",
    ],
    rating: 4.9,
    reviewCount: 16,
    reviews: [
      {
        rating: 5,
        title: "Best pet tag we have tried",
        text: "Feels much more useful than a plain metal tag because the profile can include pet notes and an emergency contact.",
        reviewerName: "Nisha P.",
        location: "Hyderabad",
        createdAt: "2026-05-05",
      },
      {
        rating: 5,
        title: "Very easy to set up",
        text: "The collar tag arrived quickly and the QR profile was already ready in my dashboard by the time I paid.",
        reviewerName: "Farhan T.",
        location: "Lucknow",
        createdAt: "2026-04-18",
      },
    ],
  },
  {
    title: "Child Safety Wristband",
    slug: "child-safety-wristband",
    legacySlugs: ["child-safety-tag", "wristband-qr-tag"],
    skuCode: "QRN-CHILD-WRIST-001",
    description:
      "A child safety wristband built for travel, outings, public events, and daily protection. The QR is permanently linked to your child's QRNetra profile, so parent contacts and safety notes can be updated later without replacing the wristband.",
    shortDescription:
      "Child safety wristband with a permanent QR linked to parent and emergency details.",
    imageDirectory: "child-safety-wristband",
    images: [
      {
        src: "/products/child-safety-wristband/main.svg",
        alt: "Child Safety Wristband hero product image",
      },
      {
        src: "/products/child-safety-wristband/detail-1.svg",
        alt: "Child Safety Wristband worn on a child's wrist",
      },
      {
        src: "/products/child-safety-wristband/detail-2.svg",
        alt: "Child Safety Wristband scan use case illustration",
      },
    ],
    price: 399,
    salePrice: null,
    category: "kids",
    tags: ["child", "wristband", "travel", "emergency"],
    stock: 160,
    shippingWeight: 0.02,
    faq: [
      {
        question: "When is the wristband best used?",
        answer:
          "It is ideal for travel, crowded outings, malls, theme parks, and any place where a quick guardian contact path matters.",
      },
      {
        question: "Can medical or allergy information be updated later?",
        answer:
          "Yes. The linked child safety profile remains editable from your dashboard after purchase.",
      },
    ],
    activeStatus: true,
    profileKind: "child",
    profileVariant: "child_wristband",
    features: [
      "Permanent QR linked to a child safety profile",
      "Fast parent and emergency contact access",
      "Works well for travel and public outings",
      "Child details remain editable after delivery",
    ],
    benefits: [
      "Provides reassurance in crowded public spaces",
      "Keeps emergency contact information tied to a wearable item",
      "Reduces the need to reprint when details change later",
    ],
    specifications: [
      { label: "Format", value: "Child safety wristband" },
      { label: "Use case", value: "Travel, outings, events, child safety" },
      { label: "QR destination", value: "Permanent QRNetra child profile" },
      { label: "Linked profile", value: "Child dashboard profile" },
    ],
    deliveryInfo: [
      "Made-to-order print after successful payment",
      "Estimated delivery in 3-5 business days across India",
      "Shipping updates and tracking stay available in your dashboard",
    ],
    rating: 4.8,
    reviewCount: 12,
    reviews: [
      {
        rating: 5,
        title: "Excellent for travel days",
        text: "We used it on a family trip and liked knowing the same QR can be updated later if our contact details change.",
        reviewerName: "Monika G.",
        location: "Jaipur",
        createdAt: "2026-05-07",
      },
      {
        rating: 4,
        title: "Useful and reassuring",
        text: "The wristband setup flow was simple and the QR profile appeared in the dashboard immediately after creation.",
        reviewerName: "Karan D.",
        location: "Ahmedabad",
        createdAt: "2026-04-20",
      },
    ],
  },
  {
    title: "Child School Bag Tag",
    slug: "child-school-bag-tag",
    legacySlugs: ["school-bag-tag"],
    skuCode: "QRN-CHILD-BAG-001",
    description:
      "A school-ready QR tag designed for daily bag use. It permanently connects to your child's QRNetra profile so school, class, parent, and emergency details can change over time while the physical bag tag stays the same.",
    shortDescription:
      "School bag QR tag linked permanently to a child safety dashboard profile.",
    imageDirectory: "child-school-bag-tag",
    images: [
      {
        src: "/products/child-school-bag-tag/main.svg",
        alt: "Child School Bag Tag hero product image",
      },
      {
        src: "/products/child-school-bag-tag/detail-1.svg",
        alt: "Child School Bag Tag attached to a school bag",
      },
      {
        src: "/products/child-school-bag-tag/detail-2.svg",
        alt: "Child School Bag Tag school profile use case illustration",
      },
    ],
    price: 399,
    salePrice: null,
    category: "kids",
    tags: ["school", "bag", "child", "guardian"],
    stock: 175,
    shippingWeight: 0.03,
    faq: [
      {
        question: "Can I include school and class information?",
        answer:
          "Yes. The school bag tag flow supports school name, class, and teacher contact details in addition to parent and emergency information.",
      },
      {
        question: "Will the QR still work after the school year changes?",
        answer:
          "Yes. The printed QR stays the same while you can update class, teacher, and school information from the dashboard later.",
      },
    ],
    activeStatus: true,
    profileKind: "child",
    profileVariant: "child_school_bag",
    features: [
      "Permanent QR linked to a child school profile",
      "Parent, school, and emergency contact fields",
      "Built for everyday school bag attachment",
      "Editable profile without reprinting the tag",
    ],
    benefits: [
      "Keeps daily school safety information easy to maintain",
      "Makes parent and school contacts easier to reach in urgent situations",
      "Helps families avoid replacing the tag when class information changes",
    ],
    specifications: [
      { label: "Format", value: "School bag QR tag" },
      { label: "Use case", value: "Daily school carry and guardian contact" },
      { label: "QR destination", value: "Permanent QRNetra child profile" },
      { label: "Linked profile", value: "Child dashboard profile" },
    ],
    deliveryInfo: [
      "Printed after payment confirmation and packed within 1 business day",
      "Estimated delivery in 3-5 business days across India",
      "Dashboard order page shows tracking once dispatched",
    ],
    rating: 4.9,
    reviewCount: 14,
    reviews: [
      {
        rating: 5,
        title: "Ideal for school routines",
        text: "The bag tag format is perfect for everyday school use and I like that class details can be updated later.",
        reviewerName: "Sneha R.",
        location: "Noida",
        createdAt: "2026-05-09",
      },
      {
        rating: 5,
        title: "Setup was very smooth",
        text: "We created the child profile first, then finished the address and payment flow without having to repeat information.",
        reviewerName: "Aparna V.",
        location: "Bengaluru",
        createdAt: "2026-04-24",
      },
    ],
  },
];

const LEGACY_PRODUCT_ALIAS_MAP = new Map<string, ProductSlug>();
for (const product of PHYSICAL_PRODUCTS) {
  for (const legacySlug of product.legacySlugs ?? []) {
    LEGACY_PRODUCT_ALIAS_MAP.set(legacySlug, product.slug);
  }
}

export const PRODUCTS: Product[] = PHYSICAL_PRODUCTS;
export const PRODUCT_CATEGORIES = Object.values(PRODUCT_CATEGORY_META).filter(
  (category) => category.featuredSlugs.length > 0,
);

function resolveCanonicalSlug(slug: string) {
  return LEGACY_PRODUCT_ALIAS_MAP.get(slug) ?? slug;
}

export function getPriceLabel(product: Product) {
  const amount = product.salePrice ?? product.price;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function getDiscountPercent(product: Product) {
  if (!product.salePrice || product.salePrice >= product.price) return null;
  return Math.round(((product.price - product.salePrice) / product.price) * 100);
}

export function isProductOnSale(product: Product) {
  return Boolean(product.salePrice && product.salePrice < product.price);
}

export function getProductHref(product: Product) {
  return `/products/${product.category}/${product.slug}`;
}

export function getActiveProducts() {
  return PRODUCTS.filter((product) => product.activeStatus);
}

export function getProduct(slug: string) {
  const canonicalSlug = resolveCanonicalSlug(slug);
  return PRODUCTS.find(
    (product) => product.slug === canonicalSlug && product.activeStatus,
  );
}

export function getProductsByCategory(category: ProductPrimaryCategory) {
  return getActiveProducts().filter((product) => product.category === category);
}

export function getCategory(key: string) {
  return PRODUCT_CATEGORY_META[key as ProductPrimaryCategory];
}

export function getCategoryLabel(category: ProductPrimaryCategory) {
  return getCategory(category).shortTitle;
}

export function getFeaturedProducts(category: ProductPrimaryCategory) {
  return PRODUCT_CATEGORY_META[category].featuredSlugs
    .map((slug) => getProduct(slug))
    .filter(Boolean) as Product[];
}

export function getRelatedProducts(product: Product, limit = 4) {
  return getProductsByCategory(product.category)
    .filter((item) => item.slug !== product.slug)
    .slice(0, limit);
}
