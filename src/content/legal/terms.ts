import type { LegalPageContent } from "@/content/types";

export const termsContent: LegalPageContent = {
  title: "Terms and Conditions",
  description:
    "By using QRNetra you agree to these terms. Please read them carefully—they explain your responsibilities and the limits of our service.",
  lastUpdated: "1 June 2026",
  sections: [
    {
      id: "service",
      title: "The service",
      body: "QRNetra provides dynamic QR profiles, a public scan experience for finders, optional email alerts, physical QR products, and a dashboard to manage your tags. We may update features as the product evolves.",
    },
    {
      id: "account",
      title: "Your account",
      list: [
        "You must provide accurate account information",
        "You are responsible for keeping your login secure",
        "One person should not impersonate another or misuse others' tags",
        "You must be legally able to enter into this agreement in India",
      ],
    },
    {
      id: "profiles",
      title: "QR profiles and accuracy",
      paragraphs: [
        "You are solely responsible for the information on your QR profiles, including phone numbers, emergency contacts, medical notes, and vehicle details.",
        "Incorrect or outdated information may prevent a finder from reaching you in an emergency. Review your profile regularly.",
        "You must not use QRNetra for unlawful purposes, harassment, spam, or misleading emergency information.",
      ],
    },
    {
      id: "activation",
      title: "Physical tags and activation",
      body: "Physical products include a unique Tag ID and activation code. Once activated and linked to your profile, the printed QR is personalized to you. Activation codes are single-use. Do not share unused codes publicly.",
    },
    {
      id: "limits",
      title: "Limitations",
      body: "QRNetra helps share contact information you provide. We do not guarantee recovery of lost persons, pets, vehicles, or items. We are not a replacement for police, ambulance, veterinary, or medical emergency services.",
    },
    {
      id: "termination",
      title: "Suspension and termination",
      body: "We may suspend accounts that violate these terms or pose risk to others. You may deactivate or delete your account from settings. Some obligations (e.g. completed orders) survive termination where required by law.",
    },
    {
      id: "law",
      title: "Governing law",
      body: "These terms are governed by the laws of India. Disputes shall be subject to the courts of competent jurisdiction in India unless otherwise required by applicable consumer protection law.",
    },
  ],
};
