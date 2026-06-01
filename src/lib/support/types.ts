export const SUPPORT_CATEGORIES = [
  { id: "order", label: "Order issue" },
  { id: "activation", label: "Activation issue" },
  { id: "lost_product", label: "Lost product" },
  { id: "wrong_scan_info", label: "Wrong scan information" },
  { id: "technical", label: "Technical issue" },
  { id: "refund", label: "Refund request" },
  { id: "general", label: "General enquiry" },
] as const;

export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number]["id"];

export function isSupportCategory(value: string): value is SupportCategory {
  return SUPPORT_CATEGORIES.some((c) => c.id === value);
}

export const SUPPORT_CONTACT = {
  email: "qrnetra@gmail.com",
  phone: "7021454183",
  phoneDisplay: "+91 70214 54183",
  whatsappUrl: "https://wa.me/917021454183",
} as const;
