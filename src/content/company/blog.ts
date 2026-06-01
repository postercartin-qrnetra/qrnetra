export const BLOG_CATEGORIES = [
  {
    slug: "vehicle-safety",
    title: "Vehicle Safety",
    description: "Parking, roadside contact, and responsible vehicle identification.",
  },
  {
    slug: "pet-safety",
    title: "Pet Safety",
    description: "Lost pet recovery, collars, and what to put on a pet tag.",
  },
  {
    slug: "child-safety",
    title: "Child Safety",
    description: "School bags, wristbands, and guardian contact best practices.",
  },
  {
    slug: "qr-technology",
    title: "QR Technology",
    description: "How dynamic QR profiles work and why they matter.",
  },
  {
    slug: "emergency-preparedness",
    title: "Emergency Preparedness",
    description: "Planning contacts and information before an incident.",
  },
  {
    slug: "lost-and-found",
    title: "Lost & Found Stories",
    description: "Real lessons from returns and recoveries (published when ready).",
  },
  {
    slug: "product-guides",
    title: "Product Guides",
    description: "How to choose, activate, and care for QRNetra products.",
  },
] as const;

/** Manually add published posts here in the future — no auto-generated articles */
export const PUBLISHED_BLOG_POSTS: { slug: string; title: string; category: string }[] =
  [];
