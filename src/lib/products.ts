import type { QrKind } from "@/lib/qr/types";

export type ProductPrimaryCategory = "vehicles" | "pets" | "kids" | "assets";

export type ProductSlug = string;

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductFaq = {
  question: string;
  answer: string;
};

export type ProductReview = {
  quote: string;
  author: string;
  location: string;
};

export type Product = {
  title: string;
  slug: ProductSlug;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  price: number;
  salePrice: number | null;
  category: ProductPrimaryCategory;
  tags: string[];
  stock: number;
  shippingWeight: number;
  faq: ProductFaq[];
  activeStatus: boolean;
  profileKind: Extract<QrKind, "vehicle" | "pet" | "child" | "asset">;
  features: string[];
  benefits: string[];
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
    title: "Vehicle QR Stickers",
    shortTitle: "Vehicles",
    href: "/products/vehicles",
    description:
      "Parking contact stickers and vehicle safety tags built for cars, bikes, helmets, and everyday movement.",
    benefits: [
      "Avoid number exposure in public parking",
      "Get contacted fast during emergencies",
      "Weatherproof materials for Indian roads",
    ],
    faq: [
      {
        question: "Will my phone number be public?",
        answer:
          "No. QRNetra routes contact through your configured scan profile, so you can share the right details without printing your number on the sticker.",
      },
      {
        question: "Can I update the linked details later?",
        answer:
          "Yes. The QR stays the same while profile data can be edited from your account.",
      },
    ],
    seoTitle: "Vehicle QR Stickers for Cars, Bikes, and Helmets",
    seoDescription:
      "Shop QR safety stickers for cars, bikes, helmets, and parking contact use cases. Privacy-first, weatherproof, and built for India.",
    featuredSlugs: [
      "car-qr-sticker",
      "bike-qr-sticker",
      "parking-contact-sticker",
    ],
  },
  pets: {
    key: "pets",
    title: "Pet QR Tags",
    shortTitle: "Pets",
    href: "/products/pets",
    description:
      "Recovery-ready pet tags and ID stickers that help finders reach owners quickly and safely.",
    benefits: [
      "Fast owner reach-out from any phone",
      "Supports vet and emergency notes",
      "Lightweight tag options for collars and harnesses",
    ],
    faq: [
      {
        question: "Can I add vet and medical information?",
        answer:
          "Yes. Pet products link to a QR profile where you can store medical and recovery notes.",
      },
      {
        question: "Are the tags suitable for outdoor use?",
        answer:
          "Yes. Pet tags are designed for outdoor wear and day-to-day activity.",
      },
    ],
    seoTitle: "Pet QR Tags for Dogs and Cats",
    seoDescription:
      "Shop QR pet tags for dogs and cats with owner contact, vet info, and safe-return support.",
    featuredSlugs: ["dog-collar-tag", "cat-collar-tag", "pet-id-tag"],
  },
  kids: {
    key: "kids",
    title: "Kid Safety QR Tags",
    shortTitle: "Kids",
    href: "/products/kids",
    description:
      "Child safety tags and school-ready QR products designed for fast parent contact when it matters most.",
    benefits: [
      "School bag and wrist-friendly formats",
      "Parent and guardian emergency contact support",
      "Lightweight designs for everyday use",
    ],
    faq: [
      {
        question: "What details are required for a kid safety tag?",
        answer:
          "Only essential child and parent contact details are needed at checkout. You can add more profile details later.",
      },
      {
        question: "Are kid tags suitable for school use?",
        answer:
          "Yes. These products are designed for school bags, ID cards, and everyday safety use.",
      },
    ],
    seoTitle: "Kid Safety QR Tags and Wristbands",
    seoDescription:
      "Buy child safety QR tags for school bags, wristbands, and emergency identification.",
    featuredSlugs: ["school-bag-tag", "child-safety-tag", "wristband-qr-tag"],
  },
  assets: {
    key: "assets",
    title: "Asset QR Tags",
    shortTitle: "Assets",
    href: "/products/assets",
    description:
      "Recovery-oriented QR tags and stickers for keys, wallets, laptops, luggage, and personal belongings.",
    benefits: [
      "Great for high-misplacement personal items",
      "Simple recovery instructions for finders",
      "Compact formats for everyday carry",
    ],
    faq: [
      {
        question: "Do asset tags work for luggage and travel items?",
        answer:
          "Yes. Asset products are ideal for luggage, backpacks, wallets, laptops, and keys.",
      },
      {
        question: "Can I reuse the same QR profile after a replacement order?",
        answer:
          "Yes. The replacement product can point to your existing QR profile instead of recreating it.",
      },
    ],
    seoTitle: "Asset QR Tags for Keys, Wallets, Luggage, and Laptops",
    seoDescription:
      "Shop QR asset tags and stickers for keys, wallets, luggage, bikes, and laptops with recovery-ready contact flows.",
    featuredSlugs: ["keys-tag", "wallet-tag", "laptop-sticker"],
  },
};

export const PRODUCT_CATEGORIES = Object.values(PRODUCT_CATEGORY_META);

export const PRODUCTS: Product[] = [
  {
    title: "Car QR Sticker",
    slug: "car-qr-sticker",
    description:
      "A premium windshield-safe QR sticker for cars that helps finders or neighbors contact you fast without exposing your number publicly.",
    shortDescription: "Privacy-first car parking and emergency contact sticker.",
    images: [{ src: "/products/vehicle-qr.svg", alt: "Car QR sticker product illustration" }],
    price: 349,
    salePrice: 299,
    category: "vehicles",
    tags: ["bestseller", "car", "parking", "weatherproof"],
    stock: 148,
    shippingWeight: 0.08,
    faq: [
      {
        question: "Where should I place the car sticker?",
        answer:
          "Inside the windshield or another visible glass area where a finder can scan it without removing anything.",
      },
      {
        question: "Does it work for parking issues?",
        answer:
          "Yes. It is designed specifically for wrong-parking and quick owner contact scenarios.",
      },
    ],
    activeStatus: true,
    profileKind: "vehicle",
    features: [
      "Weatherproof adhesive",
      "Masked contact flow",
      "Instant scan support",
      "Editable linked QR profile",
    ],
    benefits: [
      "Avoid missed calls from public parking issues",
      "Stay reachable without showing your number",
      "Use the same profile for future replacements",
    ],
    rating: 4.8,
    reviewCount: 214,
    reviews: [
      {
        quote: "Parking issues now get solved in minutes without printing my number.",
        author: "Rahul S.",
        location: "Mumbai",
      },
    ],
  },
  {
    title: "Bike QR Sticker",
    slug: "bike-qr-sticker",
    description:
      "Compact QR sticker for bikes and scooters, built to handle weather and everyday riding while keeping owner contact one scan away.",
    shortDescription: "Compact safety sticker for bikes and scooters.",
    images: [{ src: "/products/vehicle-qr.svg", alt: "Bike QR sticker product illustration" }],
    price: 329,
    salePrice: null,
    category: "vehicles",
    tags: ["bike", "scooter", "compact"],
    stock: 122,
    shippingWeight: 0.06,
    faq: [
      {
        question: "Is the bike sticker waterproof?",
        answer:
          "Yes. It is intended for regular outdoor riding conditions and daily commuting.",
      },
      {
        question: "Can it be used on scooters too?",
        answer: "Yes. The product works for bikes, scooters, and other two-wheelers.",
      },
    ],
    activeStatus: true,
    profileKind: "vehicle",
    features: [
      "Compact form factor",
      "Weather-ready finish",
      "Simple bike owner contact flow",
      "Works with vehicle QR profile",
    ],
    benefits: [
      "Better reachability for parking and emergencies",
      "Ideal for urban commuters",
      "Easy to attach and scan",
    ],
    rating: 4.7,
    reviewCount: 151,
    reviews: [
      {
        quote: "Small, clean, and actually useful when my bike gets blocked in parking.",
        author: "Neeraj K.",
        location: "Pune",
      },
    ],
  },
  {
    title: "Helmet QR Sticker",
    slug: "helmet-qr-sticker",
    description:
      "A lightweight helmet QR sticker for riders who want a visible emergency contact and identity layer on their gear.",
    shortDescription: "Emergency QR sticker for helmets and rider gear.",
    images: [{ src: "/products/vehicle-qr.svg", alt: "Helmet QR sticker product illustration" }],
    price: 249,
    salePrice: 219,
    category: "vehicles",
    tags: ["helmet", "rider", "safety"],
    stock: 97,
    shippingWeight: 0.04,
    faq: [
      {
        question: "Can I stick it on a riding helmet?",
        answer:
          "Yes. It is designed for helmet and accessory placement where scanning remains easy.",
      },
      {
        question: "Can I use the same vehicle profile?",
        answer:
          "Yes. The sticker can link to an existing vehicle-oriented QR profile if you already have one.",
      },
    ],
    activeStatus: true,
    profileKind: "vehicle",
    features: [
      "Helmet-safe sticker size",
      "Fast scan access",
      "Emergency contact support",
      "Minimal visual footprint",
    ],
    benefits: [
      "Adds recovery and reachability to riding gear",
      "Low-cost add-on for riders",
      "Useful for clubs and daily commuters",
    ],
    rating: 4.6,
    reviewCount: 86,
    reviews: [
      {
        quote: "A small but smart addition to my daily riding gear.",
        author: "Amit V.",
        location: "Bengaluru",
      },
    ],
  },
  {
    title: "Parking Contact Sticker",
    slug: "parking-contact-sticker",
    description:
      "A dedicated parking-focused QR sticker designed to help others contact you quickly in blocked exits, society parking, and temporary stops.",
    shortDescription: "Parking-first QR contact sticker for fast owner reach.",
    images: [{ src: "/products/vehicle-qr.svg", alt: "Parking contact sticker illustration" }],
    price: 299,
    salePrice: null,
    category: "vehicles",
    tags: ["parking", "contact", "car"],
    stock: 136,
    shippingWeight: 0.05,
    faq: [
      {
        question: "How is this different from a regular number sticker?",
        answer:
          "It keeps your public number off the sticker while still letting finders contact you through QRNetra.",
      },
      {
        question: "Is it suitable for apartments and offices?",
        answer:
          "Yes. It is especially useful in gated communities, offices, and dense parking environments.",
      },
    ],
    activeStatus: true,
    profileKind: "vehicle",
    features: [
      "Parking-first messaging",
      "Quick owner reach-out",
      "Clean windshield design",
      "No printed mobile number required",
    ],
    benefits: [
      "Built for the most common real-world vehicle need",
      "Simple value proposition for conversion",
      "Works with existing vehicle QR profiles",
    ],
    rating: 4.8,
    reviewCount: 129,
    reviews: [
      {
        quote: "Exactly what I wanted for city parking without sharing my number.",
        author: "Priya M.",
        location: "Delhi",
      },
    ],
  },
  {
    title: "Dog Collar Tag",
    slug: "dog-collar-tag",
    description:
      "A durable dog collar QR tag with owner contact, medical notes, and safe-return details in one scan-ready format.",
    shortDescription: "Durable QR dog tag for collars and harnesses.",
    images: [{ src: "/products/pet-qr.svg", alt: "Dog collar QR tag illustration" }],
    price: 299,
    salePrice: 259,
    category: "pets",
    tags: ["dog", "collar", "recovery", "popular"],
    stock: 88,
    shippingWeight: 0.05,
    faq: [
      {
        question: "Can I add vet details for my dog?",
        answer:
          "Yes. The linked QR profile supports vet and medical notes for recovery use cases.",
      },
      {
        question: "Will this work on harnesses too?",
        answer: "Yes. It can be attached to collars, harnesses, and similar pet gear.",
      },
    ],
    activeStatus: true,
    profileKind: "pet",
    features: [
      "Durable collar attachment",
      "Fast owner contact",
      "Vet note support",
      "Lightweight design",
    ],
    benefits: [
      "Built for lost-pet recovery moments",
      "Easy for finders to understand and use",
      "Works with your existing pet QR profile",
    ],
    rating: 4.9,
    reviewCount: 173,
    reviews: [
      {
        quote: "This is the first pet tag I’ve used that feels actually useful in a real recovery moment.",
        author: "Nisha P.",
        location: "Hyderabad",
      },
    ],
  },
  {
    title: "Cat Collar Tag",
    slug: "cat-collar-tag",
    description:
      "A lightweight QR cat tag optimized for smaller collars while still supporting essential recovery and owner contact details.",
    shortDescription: "Lightweight QR tag built for cats and smaller collars.",
    images: [{ src: "/products/pet-qr.svg", alt: "Cat collar QR tag illustration" }],
    price: 279,
    salePrice: null,
    category: "pets",
    tags: ["cat", "collar", "lightweight"],
    stock: 73,
    shippingWeight: 0.04,
    faq: [
      {
        question: "Is the tag small enough for cats?",
        answer:
          "Yes. This variant is designed with lighter everyday use in mind.",
      },
      {
        question: "Can I update owner details later?",
        answer:
          "Yes. Your QR profile can be updated anytime from your account.",
      },
    ],
    activeStatus: true,
    profileKind: "pet",
    features: [
      "Cat-friendly size",
      "Owner and emergency contact",
      "Editable QR profile",
      "Outdoor-use ready",
    ],
    benefits: [
      "Good fit for smaller pets",
      "Simple and scan-friendly recovery flow",
      "No need to replace the QR for profile edits",
    ],
    rating: 4.7,
    reviewCount: 64,
    reviews: [
      {
        quote: "Finally found a cat tag that isn’t bulky and still gives useful contact info.",
        author: "Jasleen A.",
        location: "Chandigarh",
      },
    ],
  },
  {
    title: "Pet ID Tag",
    slug: "pet-id-tag",
    description:
      "A general-purpose QR pet ID tag for dogs, cats, and mixed-pet households looking for a flexible recovery product.",
    shortDescription: "General-purpose pet QR tag with flexible profile support.",
    images: [{ src: "/products/pet-qr.svg", alt: "Pet ID QR tag illustration" }],
    price: 249,
    salePrice: 229,
    category: "pets",
    tags: ["pet", "id", "bestseller"],
    stock: 104,
    shippingWeight: 0.05,
    faq: [
      {
        question: "Can I use this for any pet type?",
        answer:
          "Yes. It is suitable for general pet recovery and owner contact use cases.",
      },
      {
        question: "Does it support medical notes?",
        answer:
          "Yes. Medical notes can be included in the connected pet profile.",
      },
    ],
    activeStatus: true,
    profileKind: "pet",
    features: [
      "General-purpose pet format",
      "Recovery-ready owner contact",
      "Vet and notes support",
      "Compact hardware",
    ],
    benefits: [
      "Best default option for most pet owners",
      "Clear contact recovery workflow",
      "Easy to attach and manage",
    ],
    rating: 4.8,
    reviewCount: 111,
    reviews: [
      {
        quote: "Great default tag if you want something practical without overthinking it.",
        author: "Sonal D.",
        location: "Ahmedabad",
      },
    ],
  },
  {
    title: "School Bag Tag",
    slug: "school-bag-tag",
    description:
      "A QR safety tag designed for school bags with fast parent contact and child safety context in one simple scan.",
    shortDescription: "School bag QR tag for parent contact and child safety.",
    images: [{ src: "/products/kid-qr.svg", alt: "School bag QR tag illustration" }],
    price: 349,
    salePrice: 299,
    category: "kids",
    tags: ["school", "bag", "child", "bestseller"],
    stock: 116,
    shippingWeight: 0.06,
    faq: [
      {
        question: "Can I add parent and emergency contact details?",
        answer:
          "Yes. Parent and emergency contact fields are supported in the linked child profile.",
      },
      {
        question: "Is this good for school bags specifically?",
        answer:
          "Yes. This is the most common use case for this product.",
      },
    ],
    activeStatus: true,
    profileKind: "child",
    features: [
      "Bag-friendly format",
      "Parent contact support",
      "Emergency note support",
      "Profile editable anytime",
    ],
    benefits: [
      "Ideal for school-going children",
      "Makes lost-bag identification easier",
      "Supports quick guardian contact",
    ],
    rating: 4.8,
    reviewCount: 142,
    reviews: [
      {
        quote: "This gave us real peace of mind for school commute days.",
        author: "Megha R.",
        location: "Noida",
      },
    ],
  },
  {
    title: "Child Safety Tag",
    slug: "child-safety-tag",
    description:
      "A child-first QR emergency tag designed for outings, travel, and daily safety situations where parent contact matters.",
    shortDescription: "General child safety QR tag for daily use and travel.",
    images: [{ src: "/products/kid-qr.svg", alt: "Child safety QR tag illustration" }],
    price: 379,
    salePrice: null,
    category: "kids",
    tags: ["child", "safety", "travel"],
    stock: 83,
    shippingWeight: 0.05,
    faq: [
      {
        question: "What details should I add for a child safety tag?",
        answer:
          "Only the essential child and guardian details are required to begin. You can expand profile info later.",
      },
      {
        question: "Can I include medical information?",
        answer:
          "Yes. Medical notes and safety instructions can be included where needed.",
      },
    ],
    activeStatus: true,
    profileKind: "child",
    features: [
      "Child-first safety design",
      "Guardian contact flow",
      "Medical note support",
      "Lightweight build",
    ],
    benefits: [
      "Useful beyond school, including travel and events",
      "Flexible emergency contact setup",
      "Easy to scan from any phone",
    ],
    rating: 4.7,
    reviewCount: 78,
    reviews: [
      {
        quote: "We use it for trips and crowded outings. Very reassuring.",
        author: "Harshita T.",
        location: "Jaipur",
      },
    ],
  },
  {
    title: "Wristband QR Tag",
    slug: "wristband-qr-tag",
    description:
      "A wearable QR wristband that keeps emergency child information available in a compact and practical everyday format.",
    shortDescription: "Wearable child safety QR wristband for events and outings.",
    images: [{ src: "/products/kid-qr.svg", alt: "QR wristband illustration" }],
    price: 449,
    salePrice: 399,
    category: "kids",
    tags: ["wristband", "wearable", "event"],
    stock: 65,
    shippingWeight: 0.07,
    faq: [
      {
        question: "Is this suitable for events and travel?",
        answer:
          "Yes. It is especially useful when you want the QR to remain on the child directly.",
      },
      {
        question: "Can I change the linked profile later?",
        answer:
          "Yes. The connected child profile can be edited from your account without changing the band.",
      },
    ],
    activeStatus: true,
    profileKind: "child",
    features: [
      "Wearable format",
      "Fast scan visibility",
      "Child profile support",
      "Travel and event friendly",
    ],
    benefits: [
      "Ideal for outings, events, and trips",
      "Keeps contact details attached to the child",
      "High utility for mobile-first emergencies",
    ],
    rating: 4.9,
    reviewCount: 57,
    reviews: [
      {
        quote: "Perfect for event days when kids can get separated in crowds.",
        author: "Shalini C.",
        location: "Kolkata",
      },
    ],
  },
  {
    title: "Keys Tag",
    slug: "keys-tag",
    description:
      "A compact QR tag for keys with recovery-focused owner contact and simple instructions for finders.",
    shortDescription: "Compact QR tag for keys and keychains.",
    images: [{ src: "/products/asset-qr.svg", alt: "Keys QR tag illustration" }],
    price: 199,
    salePrice: 179,
    category: "assets",
    tags: ["keys", "compact", "recovery"],
    stock: 152,
    shippingWeight: 0.03,
    faq: [
      {
        question: "Can this link to an existing asset profile?",
        answer:
          "Yes. Asset products can link to an existing asset QR profile instead of recreating one.",
      },
      {
        question: "Is it small enough for keychains?",
        answer:
          "Yes. This product is designed specifically for key use and compact carry.",
      },
    ],
    activeStatus: true,
    profileKind: "asset",
    features: [
      "Key-friendly compact size",
      "Fast owner contact",
      "Editable recovery profile",
      "Minimal everyday bulk",
    ],
    benefits: [
      "Low-friction asset recovery setup",
      "Great first-time QR recovery product",
      "Easy to gift or bundle",
    ],
    rating: 4.8,
    reviewCount: 187,
    reviews: [
      {
        quote: "Exactly the kind of product that makes sense for keys.",
        author: "Arjun P.",
        location: "Gurugram",
      },
    ],
  },
  {
    title: "Wallet Tag",
    slug: "wallet-tag",
    description:
      "A slim QR wallet tag designed to help honest finders reach you quickly without exposing sensitive details publicly.",
    shortDescription: "Slim QR recovery tag for wallets and card holders.",
    images: [{ src: "/products/asset-qr.svg", alt: "Wallet QR tag illustration" }],
    price: 229,
    salePrice: null,
    category: "assets",
    tags: ["wallet", "slim", "essentials"],
    stock: 118,
    shippingWeight: 0.03,
    faq: [
      {
        question: "Does the wallet tag reveal personal information?",
        answer:
          "No. It is designed to help the finder contact you without printing sensitive details directly on the product.",
      },
      {
        question: "Can I use it for card holders too?",
        answer: "Yes. It works well for wallets, card sleeves, and similar essentials.",
      },
    ],
    activeStatus: true,
    profileKind: "asset",
    features: [
      "Slim profile",
      "Recovery-oriented setup",
      "Simple contact workflow",
      "Everyday carry friendly",
    ],
    benefits: [
      "Strong practical use case for essentials",
      "Easy cross-sell alongside keys tags",
      "Good for repeat replacement orders",
    ],
    rating: 4.6,
    reviewCount: 92,
    reviews: [
      {
        quote: "A smart add-on for something you really don’t want to lose.",
        author: "Karan B.",
        location: "Surat",
      },
    ],
  },
  {
    title: "Laptop Sticker",
    slug: "laptop-sticker",
    description:
      "A QR recovery sticker for laptops and work devices that helps honest finders or office teams contact the owner quickly.",
    shortDescription: "QR recovery sticker for laptops and work devices.",
    images: [{ src: "/products/asset-qr.svg", alt: "Laptop QR sticker illustration" }],
    price: 249,
    salePrice: 219,
    category: "assets",
    tags: ["laptop", "device", "work", "sticker"],
    stock: 91,
    shippingWeight: 0.04,
    faq: [
      {
        question: "Can I use this for office laptops too?",
        answer:
          "Yes. It is useful for both personal and work devices that benefit from recovery contact info.",
      },
      {
        question: "Will it damage the laptop surface?",
        answer:
          "It is built as a standard adhesive sticker product and should be applied to a clean, suitable surface.",
      },
    ],
    activeStatus: true,
    profileKind: "asset",
    features: [
      "Device-friendly sticker format",
      "Asset recovery support",
      "Simple owner contact flow",
      "Works with asset QR profiles",
    ],
    benefits: [
      "High-value device protection use case",
      "Strong B2C and work-device appeal",
      "Useful for replacements and bundle packs later",
    ],
    rating: 4.7,
    reviewCount: 101,
    reviews: [
      {
        quote: "Feels like the right kind of recovery layer for laptops and work devices.",
        author: "Dev M.",
        location: "Bengaluru",
      },
    ],
  },
  {
    title: "Luggage Tag",
    slug: "luggage-tag",
    description:
      "A QR travel tag for luggage and backpacks with recovery contact and return instructions in a simple scanable format.",
    shortDescription: "Travel-ready QR tag for luggage and backpacks.",
    images: [{ src: "/products/asset-qr.svg", alt: "Luggage QR tag illustration" }],
    price: 279,
    salePrice: 249,
    category: "assets",
    tags: ["luggage", "travel", "bag"],
    stock: 79,
    shippingWeight: 0.06,
    faq: [
      {
        question: "Can I add travel-specific instructions?",
        answer:
          "Yes. Recovery instructions can be included in the linked asset profile.",
      },
      {
        question: "Is this suitable for backpacks too?",
        answer: "Yes. It works well for backpacks, suitcases, and travel bags.",
      },
    ],
    activeStatus: true,
    profileKind: "asset",
    features: [
      "Travel-focused format",
      "Recovery instruction support",
      "Simple contact flow",
      "Bag-friendly design",
    ],
    benefits: [
      "Useful for frequent travelers",
      "Clear use case for luggage and bags",
      "Natural bundle opportunity with keys and wallet tags",
    ],
    rating: 4.8,
    reviewCount: 84,
    reviews: [
      {
        quote: "Makes a lot of sense for travel bags and backpacks.",
        author: "Ayesha N.",
        location: "Kochi",
      },
    ],
  },
];

export function getPriceLabel(product: Product) {
  const effective = product.salePrice ?? product.price;
  return `₹${effective.toLocaleString("en-IN")}`;
}

export function getDiscountPercent(product: Product) {
  if (!product.salePrice || product.salePrice >= product.price) return null;
  return Math.round(((product.price - product.salePrice) / product.price) * 100);
}

export function isProductOnSale(product: Product) {
  return typeof product.salePrice === "number" && product.salePrice < product.price;
}

export function getProductHref(product: Product) {
  return `/products/${product.category}/${product.slug}`;
}

export function getActiveProducts() {
  return PRODUCTS.filter((product) => product.activeStatus);
}

export function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug && product.activeStatus);
}

export function getProductsByCategory(category: ProductPrimaryCategory) {
  return getActiveProducts().filter((product) => product.category === category);
}

export function getCategory(key: string) {
  return PRODUCT_CATEGORY_META[key as ProductPrimaryCategory];
}

export function getCategoryLabel(category: ProductPrimaryCategory) {
  return PRODUCT_CATEGORY_META[category].shortTitle;
}

export function getFeaturedProducts(category: ProductPrimaryCategory) {
  const meta = PRODUCT_CATEGORY_META[category];
  return meta.featuredSlugs
    .map((slug) => getProduct(slug))
    .filter((product): product is Product => Boolean(product));
}

export function getRelatedProducts(product: Product, limit = 4) {
  return getProductsByCategory(product.category)
    .filter((candidate) => candidate.slug !== product.slug)
    .slice(0, limit);
}
