import type { LegalPageContent } from "@/content/types";

export const disclaimerContent: LegalPageContent = {
  title: "Disclaimer",
  description: "Important limitations of the QRNetra service.",
  lastUpdated: "1 June 2026",
  sections: [
    {
      id: "platform",
      title: "Information facilitation only",
      body: "QRNetra is an information and contact facilitation platform. When someone scans your tag, they see the details you chose to publish and can contact you through the channels you enable.",
    },
    {
      id: "no-guarantee",
      title: "No guarantee of outcomes",
      body: "We do not guarantee that a lost child, pet, vehicle, or belonging will be found, returned, or that an emergency will be resolved. Outcomes depend on finders, authorities, and circumstances beyond our control.",
    },
    {
      id: "user-data",
      title: "User-provided information",
      body: "Emergency notes, medical information, phone numbers, and locations are provided by account holders. QRNetra does not verify medical or legal accuracy of user content.",
    },
    {
      id: "not-emergency-services",
      title: "Not emergency services",
      paragraphs: [
        "QRNetra is not a substitute for calling police (100/112), ambulance, fire, veterinary emergency services, or hospital care.",
        "In a life-threatening situation, contact official emergency services immediately.",
      ],
    },
    {
      id: "availability",
      title: "Service availability",
      body: "We aim for high uptime but do not warrant uninterrupted access. Maintenance, network issues, or third-party outages may temporarily affect scans or notifications.",
    },
  ],
};
