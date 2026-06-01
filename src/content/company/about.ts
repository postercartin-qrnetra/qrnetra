import type { MarketingPageContent } from "@/content/types";

export const aboutContent: MarketingPageContent = {
  title: "About QRNetra",
  description:
    "QRNetra helps families and businesses share the right information when it matters—through privacy-first dynamic QR tags built for India.",
  hero: "When something is lost or someone needs help, the first few minutes matter. QRNetra was built to make those minutes calmer.",
  sections: [
    {
      id: "problem",
      title: "The problem we saw",
      paragraphs: [
        "A lost pet wandering without a readable tag. A child’s bag with no way to reach a parent. A parked vehicle blocking a driveway with no contact number. Keys, laptops, and delivery assets that go missing with no simple way to return them.",
        "Paper notes fade. Static stickers become outdated the moment a phone number changes. People need something that stays current without reprinting every time life changes.",
      ],
    },
    {
      id: "approach",
      title: "Our approach",
      body: "QRNetra uses dynamic QR technology: the code on your sticker stays the same, but the profile behind it can be updated from your dashboard. You choose what finders see—call, WhatsApp, emergency contact, and optional medical or vehicle details.",
      list: [
        "Privacy-first: you control what is public on the scan page",
        "Built for Indian mobile numbers and real-world use cases",
        "Works for vehicles, children, pets, personal assets, and business fleets",
        "Physical tags for durability; free digital profiles where a sticker is not needed",
      ],
    },
    {
      id: "mission",
      title: "Mission and vision",
      paragraphs: [
        "Our mission is to help people reconnect faster when something goes wrong—without exposing more personal data than necessary.",
        "We are growing carefully: better scan insights for owners, thoughtful notifications, and physical products designed for Indian weather and daily use. We are not claiming millions of users or invented statistics; we are building something useful one tag at a time.",
      ],
    },
    {
      id: "founder",
      title: "Built with care in India",
      body: "QRNetra started from everyday situations in Indian cities and towns—where a simple, trustworthy way to leave contact information on what you care about was missing. We listen to customers who activate tags from our website and from Amazon, and we improve based on real feedback.",
    },
    {
      id: "roadmap",
      title: "Where we are headed",
      list: [
        "Clearer scan and location insights for tag owners",
        "More product options for schools, fleets, and families",
        "Continued focus on reliability, not feature noise",
        "Partnerships that respect customer privacy",
      ],
    },
  ],
};
