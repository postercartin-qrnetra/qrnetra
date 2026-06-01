import type { LegalPageContent } from "@/content/types";

export const shippingPolicyContent: LegalPageContent = {
  title: "Shipping Policy",
  description: "How we process, print, pack, and deliver QRNetra physical tags across India.",
  lastUpdated: "1 June 2026",
  sections: [
    {
      id: "processing",
      title: "Order processing",
      body: "After payment is confirmed, your order moves to processing. We link your order to the QR profile you created (or will create) and prepare your tag for production. Processing typically begins within 1–2 business days.",
    },
    {
      id: "printing",
      title: "Printing timeline",
      body: "Tags are printed with your unique QR and activation details. Printing may take several business days depending on batch volume and product type. You can track status on the Track Order page.",
    },
    {
      id: "dispatch",
      title: "Dispatch and delivery",
      body: "Once packed, your order is handed to our courier partner. Delivery estimates vary by pin code—metro areas are usually faster than remote locations. Typical India delivery is roughly 3–10 business days after dispatch, not guaranteed.",
    },
    {
      id: "tracking",
      title: "Tracking",
      body: "When available, tracking number and courier name appear on your order detail and Track Order page. Allow 24 hours after dispatch for tracking to activate.",
    },
    {
      id: "issues",
      title: "Delays, damage, and lost parcels",
      paragraphs: [
        "Weather, holidays, or courier backlog may delay delivery. Contact us if your order is significantly late.",
        "If the package arrives damaged, photograph the product and packaging and contact us within 48 hours.",
        "If tracking shows delivered but you did not receive it, contact the courier first, then reach out to us with your order number.",
      ],
    },
    {
      id: "address",
      title: "Address changes",
      body: "Contact us immediately if you need to change the shipping address. We can update only before the order is dispatched.",
    },
    {
      id: "international",
      title: "International shipping",
      body: "We currently ship within India. International shipping may be offered in the future.",
    },
  ],
};
