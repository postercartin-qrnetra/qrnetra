import type { LegalPageContent } from "@/content/types";

export const refundPolicyContent: LegalPageContent = {
  title: "Refund Policy",
  description:
    "QRNetra physical tags are personalized products. This policy explains when refunds apply and when they do not, so expectations are clear before you order.",
  lastUpdated: "1 June 2026",
  sections: [
    {
      id: "personalized",
      title: "Why refunds are limited",
      body: "Each physical tag is produced for you with a unique QR, activation code, and often custom profile details. Once printing, activation, or personalization is complete, the product cannot be resold as a generic item. This is standard for personalized safety products.",
    },
    {
      id: "eligible",
      title: "When a refund may be available",
      list: [
        "You cancel before production has started (contact us immediately with your order number)",
        "The product arrives defective or unusable due to manufacturing fault",
        "We shipped the wrong product or your order was lost in transit and not delivered",
        "Duplicate payment or clear billing error on our side",
      ],
    },
    {
      id: "not-eligible",
      title: "When refunds are generally not available",
      list: [
        "You changed your mind after the order entered printing or production",
        "The tag was activated and linked to your profile successfully",
        "The product was delivered and functions as described, but you no longer want it",
        "Finder did not call you or you did not recover a lost item (service limitation, not product defect)",
        "Incorrect profile information you entered yourself",
      ],
    },
    {
      id: "discretion",
      title: "Exceptional cases",
      body: "We may consider refunds or replacements outside the above list at our discretion—for example, documented courier damage or a genuine fulfillment error. Contact support with photos and your order number.",
    },
    {
      id: "process",
      title: "How to request help",
      body: "Email qrnetra@gmail.com or use the contact form with your order number, Tag ID if applicable, and a short description. Approved refunds are processed to the original payment method within a reasonable timeframe.",
    },
  ],
};
